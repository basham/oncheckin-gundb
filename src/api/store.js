import cuid from '@paralleldrive/cuid2';
import * as Y from 'yjs';
import { IndexeddbPersistence, storeState } from 'y-indexeddb';
import { WebsocketProvider } from 'y-websocket';
import { APP_ID, SERVER_URL } from '../constants.js';
import { getOrCreate } from '../util.js';

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

export function createRemoteStore(id) {
	const cacheKey = `remote-store:${id}`;
	return getOrCreate(cache, cacheKey, async () => {
		const store = await createLocalStore(id);
		const { storeId, doc } = store;
		const remoteProvider = new WebsocketProvider(SERVER_URL, storeId, doc);
		const bc = new BroadcastChannel(`bc-${id}`);
		const postCount = () => bc.postMessage(['count', remoteProvider.awareness.getStates().size]);
		bc.onmessage = (event) => {
			const [type] = event.data;
			if (type === 'getCount') {
				postCount();
			}
		};
		remoteProvider.awareness.on('change', postCount);
		self.addEventListener('offline', () => {
			remoteProvider.disconnect();
		});
		self.addEventListener('online', () => {
			remoteProvider.connect();
		});
		const clearData = async () => {
			bc.close();
			await store.clearData();
			remoteProvider.destroy();
			cache.delete(cacheKey);
		};
		return { ...store, clearData };
	});
}
