import * as Y from 'yjs'
import { IndexeddbPersistence, storeState } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'
export { Y }

export async function createDoc (id, options = {}) {
  const { local = false, remote = false, remoteOptions } = options
  const doc = new Y.Doc()
  doc.on('update', (u, origin) => {
    console.log('U', u, origin)
  })
  const data = doc.getMap('data')
  const localProvider = local ? new IndexeddbPersistence(id, doc) : undefined
  const save = () => localProvider ? storeState(localProvider) : Promise.resolve()
  if (localProvider) {
    await localProvider.whenSynced
  }
  const remoteProvider = remote ? new WebrtcProvider(id, doc, remoteOptions) : undefined
  if (remoteProvider) {
    const { awareness } = remoteProvider
    awareness.on('change', (changes) => {
      console.log(Array.from(awareness.getStates().values()))
    })
    awareness.setLocalStateField('user', {
      random: Math.random()
    })
    console.log('SYNCING to room', id)
  }
  return { data, doc, localProvider, remoteProvider, save }
}
