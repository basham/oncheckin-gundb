import { Y } from './util.js'
import { createWorkspace } from './workspace.js'
import { getOrCreate } from '../util.js'

export async function importWorkspace (content) {
  const { name } = content.settings
  const workspace = await createWorkspace({ name })
  const origin = 'importer'
  const didImport = new Promise((resolve) => {
    workspace.doc.on('afterTransaction', function (transaction) {
      if (transaction.origin === origin) {
        workspace.doc.off('afterTransaction', this)
        resolve(transaction)
      }
    })
  })
  // workspace.settings.set('name', 'woot')
  workspace.doc.transact(() => {
    workspace.settings.set('name', 'woot')
    for (const [id, values] of Object.entries(content.events)) {
      const event = getOrCreate(workspace.events, id, () => new Y.Map())
      for (const [key, value] of Object.entries(values)) {
        event.set(key, value)
      }
    }
    for (const [id, values] of Object.entries(content.participants)) {
      //const participant = getOrCreate(workspace.participants, id, () => new Y.Map())
      for (const [key, value] of Object.entries(values)) {
        // participant.set(key, value)
      }
    }
    for (const [id, values] of Object.entries(content.checkIns)) {
      //const checkIn = getOrCreate(workspace.checkIns, id, () => new Y.Map())
      for (const [key, value] of Object.entries(values)) {
        // checkIn.set(key, value)
      }
    }
  }, origin)
  await didImport
  await workspace.save()
}

const importStore = {
  import: importWorkspace
}

export default importStore
