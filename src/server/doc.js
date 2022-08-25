import { createYMap, createRemoteStore } from './store.js'
import { APP } from '../constants.js'
import { getOrCreate } from '../util.js'

const cache = new Map()

export async function getDocDB (id) {
  // To do: If the id does not exist in the account,
  // return undefined.
  return getOrCreate(cache, id, async () => {
    const store = await createRemoteStore(`${APP}-${id}`)
    const { doc } = store
    const data = doc.getMap('data')
    const rows = ['settings', 'checkIns', 'events', 'participants']
      .map((key) => [key, getOrCreate(data, key, createYMap)])
    const rowsEntries = Object.fromEntries(rows)
    return { id, ...store, ...rowsEntries }
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
