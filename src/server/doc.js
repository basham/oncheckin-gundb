import cuid from 'cuid'
import { createYMap, createRemoteStore } from './store.js'
import { getOrCreate } from '../util.js'

const cache = new Map()

export async function createDoc ({ name }) {
  const db = await getDocDB()
  db.settings.set('name', name)
  return db
}

export async function getDocDB (id = cuid()) {
  return getOrCreate(cache, id, async () => {
    const store = await createRemoteStore(id)
    const data = store.doc.getMap('data')
    const rows = ['settings', 'checkIns', 'events', 'participants']
      .map((key) => [key, getOrCreate(data, key, createYMap)])
    const rowsEntries = Object.fromEntries(rows)
    return { ...store, ...rowsEntries }
  })
}

export async function getDoc (id) {
  const db = await getDocDB(id)

  if (!db) {
    return
  }

  const name = db.settings.get('name') || '(Workspace)'
  const openUrl = `?p=open/${id}`
  const inviteCode = self.btoa(JSON.stringify({ id, name }))
  const shareUrl = `${self.location.origin}/?p=join/${inviteCode}`
  return {
    id,
    name,
    openUrl,
    shareUrl
  }
}

export async function importDoc (content) {
  const { name } = content.settings
  const db = await getDocDB()
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
