import cuid from 'cuid'
import * as Y from 'yjs'
import { IndexeddbPersistence, storeState } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc-packets'
import { APP_ID } from '../constants.js'

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
  const store = createMemoryStore()
  const storeId = `${APP_ID}-${id}`
  const { doc } = store
  const localProvider = new IndexeddbPersistence(storeId, doc)
  const save = () => storeState(localProvider)
  await localProvider.whenSynced
  return { ...store, id, storeId, save }
}

export async function createRemoteStore (id, options) {
  const store = await createLocalStore(id)
  const { storeId, doc } = store
  const remoteProvider = new WebrtcProvider(storeId, doc, options)
  const { awareness } = remoteProvider
  awareness.on('change', (changes) => {
    console.log(Array.from(awareness.getStates().values()))
  })
  awareness.setLocalStateField('user', {
    random: Math.random()
  })
  console.log('SYNCING to room', storeId)
  return store
}
