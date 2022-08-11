import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'

export { Y }

export async function createDoc (id, options = {}) {
  const { local = false, remote = false, remoteOptions } = options
  const doc = new Y.Doc()
  const data = doc.getMap('data')
  const localProvider = local ? new IndexeddbPersistence(id, doc) : undefined
  if (localProvider) {
    await localProvider.whenSynced
  }
  const remoteProvider = remote ? new WebrtcProvider(id, doc, remoteOptions) : undefined
  return { data, doc, localProvider, remoteProvider }
}
