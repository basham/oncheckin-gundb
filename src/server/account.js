import { getOrg } from './org.js'
import { createYMap, createRemoteStore } from './store.js'
import { createId } from './util.js'
import { getOrCreate, sortAsc } from '../util.js'

const cache = new Map()

export async function getAccountDB (id = createId()) {
  return getOrCreate(cache, id, async () => {
    const store = await createRemoteStore(id)
    const { doc } = store
    const data = doc.getMap('data')
    const rows = ['orgs']
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
  const orgs = [...db.orgs.keys()]
  const url = `/accounts/${id}/`
  return { id: db.id, type, version, name, orgs, url }
}

export async function getAccountWithOrgs (id) {
  const account = await getAccount(id)

  if (!account) {
    return
  }

  const orgs = []
  for (const orgId of account.orgs) {
    const org = await getOrg(orgId)
    orgs.push(org)
  }
  orgs.sort(sortAsc('name'))

  return { ...account, orgs }
}

export async function renameAccount (id, name) {
  const db = await getAccountDB(id)
  db.data.set('name', name)
}
