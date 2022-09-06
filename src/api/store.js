import cuid from 'cuid'
import * as Y from 'yjs'
import { IndexeddbPersistence, storeState } from 'y-indexeddb'
import { createBroadcastProvider } from '../broadcast-provider.js'
import { APP_ID } from '../constants.js'
import { getOrCreateAsync } from '../util.js'

export { Y }

export const cache = new Map()

export function createId () {
  return cuid()
}

export function createYMap () {
  return new Y.Map()
}

export function createMemoryStore () {
  const doc = new Y.Doc()
  return { doc }
}

export async function createLocalStore (id) {
  return await getOrCreateAsync(cache, `local-store:${id}`, async () => {
    const store = createMemoryStore()
    const storeId = `${APP_ID}-${id}`
    const { doc } = store
    const localProvider = new IndexeddbPersistence(storeId, doc)
    const save = () => storeState(localProvider)
    await localProvider.whenSynced
    return { ...store, id, storeId, save }
  })
}

export async function createRemoteStore (id) {
  return await getOrCreateAsync(cache, `remote-store:${id}`, async () => {
    const store = await createLocalStore(id)
    const { storeId, doc } = store
    createBroadcastProvider(storeId, doc)
    return { ...store }
  })

  /*
  const remoteProvider = new WebrtcProvider(storeId, doc, options)
  const { awareness } = remoteProvider
  awareness.on('change', (changes) => {
    console.log(Array.from(awareness.getStates().values()))
  })
  console.log('SYNCING to room', storeId)
  */
}
