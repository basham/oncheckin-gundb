import { format, parseISO } from 'date-fns'
import { createDoc, Y } from './util.js'
import { APP, URL } from '../constants.js'
import { createId, getOrCreate, sortDesc } from '../util.js'

const { btoa } = window
const cache = new Map()

export async function createWorkspace ({ name, id = createId() }) {
  const { doc: workspace } = await createDoc(`${APP}-${id}`, { local: true })
  workspace.transact(() => {
    const data = workspace.getMap('data')
    const settings = getOrCreate(data, 'settings', () => new Y.Map())
    settings.set('id', id)
    settings.set('name', name)
  })
  const { doc: meta } = await createDoc(`${APP}-meta`, { local: true })
  meta.transact(() => {
    const data = meta.getMap('data')
    data.set('current', id)
    const workspaces = getOrCreate(data, 'workspaces', () => new Y.Map())
    const workspace = getOrCreate(workspaces, id, () => new Y.Map())
    workspace.set('name', name)
    workspace.set('lastOpened', (new Date()).toJSON())
  })
  const openUrl = `?p=workspaces/open/${id}`
  return { id, name, openUrl }
}

export function createWorkspaceId (id = createId()) {
  return `${APP}-${id}`
}

export async function getCurrentWorkspaceId () {
  const { doc } = await createDoc(`${APP}-meta`, { local: true })
  return doc.getMap('data').get('current')
}

export async function getWorkspace (id) {
  id = id ?? await getCurrentWorkspaceId()
  return getOrCreate(cache, `workspace/${id}`, async () => {
    const { doc } = await createDoc(`${APP}-${id}`, { local: true, remote: true })
    const data = doc.getMap('data')
    const settings = getOrCreate(data, 'settings', () => new Y.Map())
    const name = settings.get('name') || '(Workspace)'
    const checkIns = getOrCreate(data, 'checkIns', () => new Y.Map())
    const events = getOrCreate(data, 'events', () => new Y.Map())
    const participants = getOrCreate(data, 'participants', () => new Y.Map())
    const openUrl = `?p=workspaces/open/${id}`
    const inviteCode = btoa(JSON.stringify({ id, name }))
    const shareUrl = `${URL}?p=workspaces/join/${inviteCode}`
    return {
      checkIns,
      doc,
      events,
      id,
      name,
      openUrl,
      participants,
      settings,
      shareUrl
    }
  })
}

export async function getWorkspaces () {
  const { doc } = await createDoc(`${APP}-meta`, { local: true })
  const data = doc.getMap('data')
  const workspaces = getOrCreate(data, 'workspaces', () => new Y.Map())
  return [...workspaces.entries()]
    .map(([id, workspace]) => {
      const name = workspace.get('name')
      const lastOpened = workspace.get('lastOpened')
      const lastOpenedObj = parseISO(lastOpened)
      const lastOpenedDisplay = format(lastOpenedObj, 'PP, p')
      const openUrl = `?p=workspaces/open/${id}`
      return { id, lastOpened, lastOpenedDisplay, name, openUrl }
    })
    .sort(sortDesc('lastOpened'))
}

export async function openWorkspace (id = null) {
  const { doc } = await createDoc(`${APP}-meta`, { local: true })
  doc.transact(() => {
    const data = doc.getMap('data')
    data.set('current', id)
    const workspaces = getOrCreate(data, 'workspaces', () => new Y.Map())
    workspaces.get(id).set('lastOpened', (new Date()).toJSON())
  })
  return doc
}

export async function renameWorkspace (name) {
  const { id, settings } = await getWorkspace()
  settings.set('name', name)
  const { doc: meta } = await createDoc(`${APP}-meta`, { local: true })
  meta.getMap('data').get('workspaces').get(id).set('name', name)
}

const workspaceStore = {
  create: createWorkspace,
  get: getWorkspace,
  getAll: getWorkspaces,
  open: openWorkspace,
  rename: renameWorkspace
}

export default workspaceStore
