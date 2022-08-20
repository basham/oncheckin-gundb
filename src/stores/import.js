import { storeState } from 'y-indexeddb'
import { Y } from './util.js'
import { createWorkspace, getWorkspace, openWorkspace } from './workspace.js'
import { getOrCreate } from '../util.js'

export async function importWorkspace (content) {
  const { name } = content.settings
  const { id } = await createWorkspace({ name })
  const workspace = await getWorkspace(id)
  const origin = 'importer'
  const didImport = new Promise((resolve) => {
    workspace.doc.once('afterTransaction', (transaction) => {
      if (transaction.origin === origin) {
        resolve(transaction)
      }
    })
  })
  workspace.doc.transact(() => {
    for (const [id, values] of Object.entries(content.events)) {
      const event = getOrCreate(workspace.events, id, () => new Y.Map())
      for (const [key, value] of Object.entries(values)) {
        event.set(key, value)
      }
    }
    for (const [id, values] of Object.entries(content.participants)) {
      const participant = getOrCreate(workspace.participants, id, () => new Y.Map())
      for (const [key, value] of Object.entries(values)) {
        participant.set(key, value)
      }
    }
    for (const [id, values] of Object.entries(content.checkIns)) {
      const checkIn = getOrCreate(workspace.checkIns, id, () => new Y.Map())
      for (const [key, value] of Object.entries(values)) {
        checkIn.set(key, value)
      }
    }
  }, origin)
  await didImport
  // Force saving the document to IndexedDB.
  await storeState(workspace.localProvider)
  await openWorkspace(id)
}

const importStore = {
  import: importWorkspace
}

export default importStore
