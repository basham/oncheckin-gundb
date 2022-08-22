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
  workspace.doc.transact(() => {
    workspace.settings.set('name', name)
    const items = ['events', 'participants', 'checkIns']
      .map((itemType) => Object.entries(content[itemType]).map((item) => [itemType, ...item]))
      .flat()
    for (const [itemType, id, values] of items) {
      const entity = getOrCreate(workspace[itemType], id, () => new Y.Map())
      for (const [key, value] of Object.entries(values)) {
        entity.set(key, value)
      }
    }
  }, origin)
  await didImport
  await workspace.save()
  return workspace
}

const importStore = {
  import: importWorkspace
}

export default importStore
