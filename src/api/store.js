import cuid from 'cuid';
import * as Y from 'yjs';
import { IndexeddbPersistence, storeState } from 'y-indexeddb';
import { createBroadcastProvider } from '../broadcast-provider.js';
import { APP_ID } from '../constants.js';
import { getOrCreate } from '../util.js';

export { Y };

export const cache = new Map();

export function createId() {
	return cuid();
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
		const { close } = createBroadcastProvider(storeId, doc);
		const clearData = async () => {
			await store.clearData();
			close();
			cache.delete(cacheKey);
		};
		return { ...store, clearData };
	});
}
