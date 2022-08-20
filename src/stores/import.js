import { Y } from './util.js'
import { createWorkspace, getWorkspace, openWorkspace } from './workspace.js'
import { getOrCreate } from '../util.js'

export async function importWorkspace (content) {
  const { name } = content.settings
  const { id } = await createWorkspace({ name })
  const workspace = await getWorkspace(id)
  console.log('Created', id)
  const origin = 'importer'
  const didImport = new Promise((resolve) => {
    workspace.doc.once('afterTransaction', (transaction) => {
      if (transaction.origin === origin) {
        resolve()
        console.log('RESOLVED', transaction, transaction.origin)
      }
    })
  })
  workspace.doc.transact(() => {
    for (const [id, values] of Object.entries(content.events)) {
      const event = getOrCreate(workspace.events, id, () => new Y.Map())
      for (const [key, value] of Object.entries(values)) {
        event.set(key, value)
      }
      console.log('E')
    }
    for (const [id, values] of Object.entries(content.participants)) {
      const participant = getOrCreate(workspace.participants, id, () => new Y.Map())
      for (const [key, value] of Object.entries(values)) {
        participant.set(key, value)
      }
      console.log('P')
    }
    for (const [id, values] of Object.entries(content.checkIns)) {
      const checkIn = getOrCreate(workspace.checkIns, id, () => new Y.Map())
      for (const [key, value] of Object.entries(values)) {
        checkIn.set(key, value)
      }
      console.log('C')
    }
  }, origin)
  await didImport
  await openWorkspace(id)
  console.log('Imported and opened')
}

const importStore = {
  import: importWorkspace
}

export default importStore
