import { format, parseISO } from 'date-fns'
import { createDoc, Y } from './util.js'
import { APP } from '@src/constants.js'
import { createId, getOrCreate, sortDesc } from '@src/util.js'

const { btoa } = window
const cache = new Map()

export async function createWorkspace ({ name, id = createId() }) {
  const workspace = await getWorkspace(id)
  workspace.doc.transact(() => {
    const { settings } = workspace
    settings.set('id', id)
    settings.set('name', name)
  })
  const meta = await getMeta()
  meta.doc.transact(() => {
    const { data } = meta
    data.set('current', id)
    const workspaces = getOrCreate(data, 'workspaces', () => new Y.Map())
    const workspace = getOrCreate(workspaces, id, () => new Y.Map())
    workspace.set('name', name)
    workspace.set('lastOpened', (new Date()).toJSON())
  })
  return { ...workspace, name }
}

export async function joinWorkspace (id) {
  return await createDoc(`${APP}-${id}`, { local: true, remote: true })
}

export function createWorkspaceId (id = createId()) {
  return `${APP}-${id}`
}

export async function getCurrentWorkspaceId () {
  return getOrCreate(cache, `current-workspace`, async () => {
    const { data } = await getMeta()
    return data.get('current')
  })
}

export async function getMeta () {
  return getOrCreate(cache, `meta`, async () => {
    return await createDoc(`${APP}-meta`, { local: true })
  })
}

export async function getWorkspace (docId) {
  // To do: If the id does not exist in the account,
  // return undefined.
  return getOrCreate(cache, `workspace/${docId}`, async () => {
    const document = await createDoc(`${APP}-${docId}`, { local: true, remote: true })
    const { data } = document
    const settings = getOrCreate(data, 'settings', () => new Y.Map())
    const name = settings.get('name') || '(Workspace)'
    const checkIns = getOrCreate(data, 'checkIns', () => new Y.Map())
    const events = getOrCreate(data, 'events', () => new Y.Map())
    const participants = getOrCreate(data, 'participants', () => new Y.Map())
    const openUrl = `?p=open/${docId}`
    const inviteCode = btoa(JSON.stringify({ id: docId, name }))
    const shareUrl = `${window.location.origin}/?p=join/${inviteCode}`
    return {
      ...document,
      checkIns,
      events,
      id: docId,
      name,
      openUrl,
      participants,
      settings,
      shareUrl
    }
  })
}

export async function getWorkspaces () {
  const { data } = await getMeta()
  const workspaces = getOrCreate(data, 'workspaces', () => new Y.Map())
  return [...workspaces.entries()]
    .map(([id, workspace]) => {
      const name = workspace.get('name')
      const lastOpened = workspace.get('lastOpened')
      const lastOpenedObj = parseISO(lastOpened)
      const lastOpenedDisplay = format(lastOpenedObj, 'PP, p')
      const openUrl = `?p=open/${id}`
      return { id, lastOpened, lastOpenedDisplay, name, openUrl }
    })
    .sort(sortDesc('lastOpened'))
}

export async function openWorkspace (id = null) {
  const { data, doc } = await getMeta()
  doc.transact(() => {
    data.set('current', id)
    const workspaces = getOrCreate(data, 'workspaces', () => new Y.Map())
    workspaces.get(id).set('lastOpened', (new Date()).toJSON())
  })
  return doc
}

export async function renameWorkspace (docId, name) {
  const { settings } = await getWorkspace(docId)
  settings.set('name', name)
  const { data } = await getMeta()
  data.get('workspaces').get(docId).set('name', name)
}

const workspaceStore = {
  create: createWorkspace,
  get: getWorkspace,
  getAll: getWorkspaces,
  join: joinWorkspace,
  open: openWorkspace,
  rename: renameWorkspace
}

export default workspaceStore
