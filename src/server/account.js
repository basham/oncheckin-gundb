import { format, parseISO } from 'date-fns'
import { createYMap, createLocalStore } from './store.js'
import { APP } from '../constants.js'
import { getOrCreate, sortDesc } from '../util.js'

const cache = new Map()

export async function getAccountDB () {
  const id = 'meta'
  return getOrCreate(cache, id, async () => {
    const store = await createLocalStore(`${APP}-${id}`)
    const { doc } = store
    const data = doc.getMap('data')
    const rows = ['workspaces']
      .map((key) => [key, getOrCreate(data, key, createYMap)])
    const rowsEntries = Object.fromEntries(rows)
    return { id, ...store, ...rowsEntries }
  })
}

export async function getAccount () {
  const db = await getAccountDB()

  if (!db) {
    return
  }

  const docs = [...db.workspaces.entries()]
    .map(([id, workspace]) => {
      const name = workspace.get('name')
      const lastOpened = workspace.get('lastOpened')
      const lastOpenedObj = parseISO(lastOpened)
      const lastOpenedDisplay = format(lastOpenedObj, 'PP, p')
      const openUrl = `?p=open/${id}`
      return { id, lastOpened, lastOpenedDisplay, name, openUrl }
    })
    .sort(sortDesc('lastOpened'))
  return { docs }
}

