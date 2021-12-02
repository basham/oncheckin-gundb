import {
  OnePubOneWorkspaceSyncer,
  StorageLocalStorage,
  ValidatorEs4
} from 'earthstar/dist/earthstar.min.js'
import { createId } from './util.js'
import { APP } from '../constants.js'
const { localStorage } = window

const CURRENT_WORKSPACE = `${APP}-current-workspace`
const WORKSPACES = `${APP}-workspaces`

let storage = null
let syncer = null

export function closeWorkspace () {
  localStorage.setItem(CURRENT_WORKSPACE, JSON.stringify(null))
  if (syncer) {
    syncer.close()
  }
  if (storage) {
    storage.close()
  }
}

export function createWorkspace ({ name, pub = null }) {
  const id = createId()
  const workspaceId = createWorkspaceId()
  const workspaces = getWorkspaces()
  const newWorkspaces = {
    ...workspaces,
    [id]: pub
  }
  localStorage.setItem(WORKSPACES, JSON.stringify(newWorkspaces))

  const confirmationUrl = `p=workspace-created&id=${id}`

  return {
    confirmationUrl,
    id,
    name,
    pub
  }
}

export function createWorkspaceId (id = createId()) {
  return `+${APP}.${id}`
}

export function getCurrentWorkspace () {
  const currentWorkspaceId = JSON.parse(localStorage.getItem(CURRENT_WORKSPACE))
  const workspaces = getWorkspaces()
  const currentWorkspace = workspaces[currentWorkspaceId]
}

export function getWorkspaces () {
  return JSON.parse(localStorage.getItem(WORKSPACES)) || {}
}

export function openWorkspace (id = null) {
  localStorage.setItem(CURRENT_WORKSPACE, JSON.stringify(id))
  const currentWorkspace = getCurrentWorkspace()
  const { pub } = currentWorkspace
  const workspaceId = createWorkspaceId(id)
  storage = new StorageLocalStorage([ValidatorEs4], workspaceId)
  syncer = new OnePubOneWorkspaceSyncer(storage, pub)
  syncer.syncOnceAndContinueLive()
}

const workspaceStore = {
  close: closeWorkspace,
  create: createWorkspace,
  getAll: getWorkspaces,
  getCurrent: getCurrentWorkspace,
  open: openWorkspace
}

export default workspaceStore
