import cuid from '@paralleldrive/cuid2';
import * as Y from 'yjs';
import { IndexeddbPersistence, storeState } from 'y-indexeddb';
import { WebsocketProvider } from 'y-websocket';
import { APP_ID, SERVER_URL } from '../constants.js';
import { debounce, getOrCreate } from '../util.js';

export { Y };

export const cache = new Map();

export function createId() {
	return cuid.createId();
}

export function createYMap() {
	return new Y.Map();
}

export function createMemoryStore() {
	const doc = new Y.Doc();
	return { doc };
}

export function createLocalStore(id) {
	const cacheKey = `local-store:${id}`;
	return getOrCreate(cache, cacheKey, async () => {
		const store = createMemoryStore();
		const storeId = `${APP_ID}-${id}`;
		const { doc } = store;
		const localProvider = new IndexeddbPersistence(storeId, doc);
		const clearData = async () => {
			await localProvider.clearData();
			cache.delete(cacheKey);
		};
		const save = () => storeState(localProvider);
		await localProvider.whenSynced;
		return { ...store, id, storeId, clearData, save };
	});
}

const messageReconnectTimeout = 30000;

export function createRemoteStore(id) {
	const cacheKey = `remote-store:${id}`;
	return getOrCreate(cache, cacheKey, async () => {
		const store = await createLocalStore(id);
		const { storeId, doc } = store;
		let remoteProvider;
		const bc = new BroadcastChannel(`bc-${id}`);
		const sendCount = () => {
			const value = remoteProvider ? remoteProvider.awareness.getStates().size : 0;
			console.log('COUNT', value, id);
			return bc.postMessage(['count', value]);
		};
		const createRemoteProvider = () => {
			remoteProvider = new WebsocketProvider(SERVER_URL, storeId, doc);
			remoteProvider.awareness.on('change', sendCount);
		};
		let wsLastMessageReceived;
		let wsMessageDiff = [];
		let upperOutlier;
		const destroyRemoteProvider = () => {
			wsLastMessageReceived = undefined;
			wsMessageDiff = [];
			upperOutlier = undefined;
			if (!remoteProvider) {
				return;
			}
			remoteProvider.destroy();
			remoteProvider = null;
			sendCount();
		};
		createRemoteProvider();

		function sortNumbers (a, b) {
			return a - b;
		}

		function median (source) {
			const dataset = [...source].sort(sortNumbers);
			const size = dataset.length;
			const middle = Math.floor(size / 2);
			if (size % 2 === 0) {
				return (dataset[middle - 1] + dataset[middle]) / 2;
			}
			return dataset[middle];
		}

		function outliers (source, threshold = 1.5) {
			const dataset = [...source].sort(sortNumbers);
			const size = dataset.length;
			if (size < 4) {
				return [];
			}
			const middle = Math.floor(size / 2);
			const firstHalf = dataset.slice(0, middle);
			const secondHalf = dataset.slice(middle * -1);
			const q1 = median(firstHalf);
			const q3 = median(secondHalf);
			// Interquartile Range
			const iqr = q3 - q1;
			const outlier = iqr * threshold;
			const upperOutlier = q3 + outlier;
			const lowerOutlier = q1 - outlier;
			return [lowerOutlier, upperOutlier];
		}

		// Reset the provider if it has been awhile since the last message;
		const resetInterval = setInterval(() => {
			if (!remoteProvider) {
				return;
			}

			if (wsLastMessageReceived !== remoteProvider.wsLastMessageReceived) {
				if (wsLastMessageReceived) {
					const diff = remoteProvider.wsLastMessageReceived - wsLastMessageReceived;
					wsMessageDiff.push(diff);
					const [, uo] = outliers(wsMessageDiff);
					upperOutlier = uo;
				}
				wsLastMessageReceived = remoteProvider.wsLastMessageReceived;
			}

			const diff = Date.now() - remoteProvider.wsLastMessageReceived;
			const shortWait = diff < (upperOutlier || messageReconnectTimeout);
			const offline = !self.navigator.onLine;
			if (shortWait || offline) {
				return;
			}

			console.log('OUTLIER', upperOutlier || messageReconnectTimeout, diff);
			destroyRemoteProvider();
			createRemoteProvider();
		}, 1000);

		// Reset the provider when back online after going offline.
		self.addEventListener('offline', () => {
			destroyRemoteProvider();
		});
		self.addEventListener('online', () => {
			createRemoteProvider();
		});

		bc.onmessage = (event) => {
			const [type] = event.data;
			if (type === 'getCount') {
				sendCount();
			}
		};

		const clearData = async () => {
			bc.close();
			clearInterval(resetInterval);
			await store.clearData();
			remoteProvider.destroy();
			cache.delete(cacheKey);
		};

		return { ...store, clearData };
	});
}
