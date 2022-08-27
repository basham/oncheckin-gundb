import { createYMap, createRemoteStore } from './store.js'
import { createId } from './util.js'
import { getOrCreate } from '../util.js'

const cache = new Map()

export async function createOrg ({ name }) {
  const db = await getOrgDB()
  db.settings.set('name', name)
  return db
}

export async function getOrgDB (id = createId()) {
  return getOrCreate(cache, id, async () => {
    const store = await createRemoteStore(id)
    const data = store.doc.getMap('data')
    const rows = ['settings', 'checkIns', 'events', 'participants']
      .map((key) => [key, getOrCreate(data, key, createYMap)])
    const rowsEntries = Object.fromEntries(rows)
    return { ...store, ...rowsEntries }
  })
}

export async function getOrg (id) {
  const db = await getOrgDB(id)

  if (!db) {
    return
  }

  const name = db.settings.get('name') || '(Organization)'
  const url = `/orgs/${id}/`
  const openUrl = `${url}open/`
  const inviteCode = self.btoa(JSON.stringify({ id, name }))
  const shareUrl = `${self.location.origin}/orgs/join/${inviteCode}`
  return {
    id,
    name,
    openUrl,
    shareUrl,
    url
  }
}

export async function importOrg (content) {
  const { name } = content.settings
  const db = await getOrgDB()
  const origin = 'importer'
  const didImport = new Promise((resolve) => {
    db.doc.on('afterTransaction', function (transaction) {
      if (transaction.origin === origin) {
        db.doc.off('afterTransaction', this)
        resolve(transaction)
      }
    })
  })
  db.doc.transact(() => {
    db.settings.set('name', name)
    const items = ['events', 'participants', 'checkIns']
      .map((itemType) => Object.entries(content[itemType]).map((item) => [itemType, ...item]))
      .flat()
    for (const [itemType, id, values] of items) {
      const entity = getOrCreate(db[itemType], id, createYMap)
      for (const [key, value] of Object.entries(values)) {
        entity.set(key, value)
      }
    }
  }, origin)
  await didImport
  await db.save()
  return db
}
