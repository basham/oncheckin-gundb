import * as Y from 'yjs'
import { IndexeddbPersistence, storeState } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc-packets'

export { Y }

export function createYMap () {
  return new Y.Map()
}

export function createMemoryStore () {
  const doc = new Y.Doc()
  return { doc }
}

export async function createLocalStore (id) {
  const store = createMemoryStore()
  const { doc } = store
  const localProvider = new IndexeddbPersistence(id, doc)
  const save = () => storeState(localProvider)
  await localProvider.whenSynced
  return { ...store, id, save }
}

export async function createRemoteStore (id, options) {
  const store = await createLocalStore(id)
  const { doc } = store
  const remoteProvider = new WebrtcProvider(id, doc, options)
  const { awareness } = remoteProvider
  awareness.on('change', (changes) => {
    console.log(Array.from(awareness.getStates().values()))
  })
  awareness.setLocalStateField('user', {
    random: Math.random()
  })
  console.log('SYNCING to room', id)
  return store
}
