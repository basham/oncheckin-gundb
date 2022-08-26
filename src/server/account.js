import cuid from 'cuid'
import { getDoc } from './doc.js'
import { createYMap, createRemoteStore } from './store.js'
import { getOrCreate, sortAsc } from '../util.js'

const cache = new Map()

export async function getAccountDB (id = cuid()) {
  return getOrCreate(cache, id, async () => {
    const store = await createRemoteStore(id)
    const { doc } = store
    const data = doc.getMap('data')
    const rows = ['docs']
      .map((key) => [key, getOrCreate(data, key, createYMap)])
    const rowsEntries = Object.fromEntries(rows)
    return { ...store, ...rowsEntries, data }
  })
}

export async function getAccount (id) {
  const db = await getAccountDB(id)

  if (!db) {
    return
  }

  const type = 'account'
  const version = 1
  const name = db.data.get('name')
  const docs = [...db.docs.keys()]
  return { id: db.id, type, version, name, docs }
}

export async function getAccountWithDocs (id) {
  const account = await getAccount(id)

  if (!account) {
    return
  }

  const docs = []
  for (const docId of account.docs) {
    const doc = await getDoc(docId)
    docs.push(doc)
  }
  docs.sort(sortAsc('name'))

  return { ...account, docs }
}

export async function renameAccount (id, name) {
  const db = await getAccountDB(id)
  db.data.set('name', name)
}
