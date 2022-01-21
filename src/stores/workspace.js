import { format, isToday } from 'date-fns'
import {
  OnePubOneWorkspaceSyncer,
  ValidatorEs4,
  checkAuthorKeypairIsValid,
  generateAuthorKeypair,
  isErr
} from 'earthstar/dist/earthstar.min.js'
import { EarthstarStorage, localStorage, btoa } from './storage.js'
import { APP, URL } from '../constants.js'
import { createId, getOrCreate, parseExtension, randomWord, resolvePath, sortAsc } from '../util.js'

const CURRENT_AUTHOR = `${APP}-current-author`
const CURRENT_WORKSPACE = `${APP}-current-workspace`
const fileName = 'workspace.json'
const storages = new Map()
const syncers = new Map()
const workspaces = new Map()

const extDecodeMap = {
  json: (content) => JSON.parse(content),
  txt: (content) => content
}

const extEncodeMap = {
  json: (storage, path, content) => {
    if (content === '') {
      return content
    }
    return JSON.stringify({
      ...(getContent(storage, path) || {}),
      ...content
    })
  },
  txt: (storage, path, content) => content
}

export async function createWorkspace ({ name, pub = null }) {
  const id = createId()
  const storage = getStorage(id)
  await setPub(id, pub)
  await setContent(storage, fileName, { name })
  const confirmationUrl = `?p=workspace-created&id=${id}`
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

export async function getContent (storage, path) {
  const ext = parseExtension(path)
  const decode = extDecodeMap[ext]
  const content = await storage.getContent(resolvePath(path))
  return content ? decode(content) : undefined
}

export function getCurrentWorkspaceId () {
  return JSON.parse(localStorage.getItem(CURRENT_WORKSPACE))
}

export function getKeypair () {
  const storedKeypair = JSON.parse(localStorage.getItem(CURRENT_AUTHOR))
  const check = checkAuthorKeypairIsValid(storedKeypair)

  if (!isErr(check)) {
    return storedKeypair
  }

  const shortname = randomWord(4)
  const keypair = generateAuthorKeypair(shortname)
  localStorage.setItem(CURRENT_AUTHOR, JSON.stringify(keypair))
  return keypair
}

export function getStorage (id = getCurrentWorkspaceId()) {
  return getOrCreate(storages, id, () => {
    const workspaceId = createWorkspaceId(id)
    return new EarthstarStorage([ValidatorEs4], workspaceId)
  })
}

export function getSyncer (id = getCurrentWorkspaceId()) {
  return getOrCreate(syncers, id, async () => {
    const storage = getStorage(id)
    const pub = await storage.getConfig('pub')
    return new OnePubOneWorkspaceSyncer(storage, pub)
  })
}

export function getWorkspace (id = getCurrentWorkspaceId()) {
  return getOrCreate(workspaces, id, async () => {
    const workspaceId = createWorkspaceId(id)
    const storage = getStorage(id)
    const syncer = await getSyncer(id)
    const get = (path) => getContent(storage, path)
    const set = (path, content) => setContent(storage, path, content)
    const data = await get(fileName) || {}
    const pub = await storage.getConfig('pub')
    const name = data.name || '(Workspace)'
    const openUrl = `?p=open-workspace&id=${id}`
    const inviteCode = btoa(JSON.stringify({ id, name, pub }))
    const shareUrl = `${URL}?p=join&code=${inviteCode}`
    const apiUrl = `${pub}earthstar-api/v1/${workspaceId}/`
    const apiPathsUrl = `${apiUrl}paths`
    const apiDocumentsUrl = `${apiUrl}documents`
    return {
      apiPathsUrl,
      apiDocumentsUrl,
      get,
      id,
      pub,
      name,
      openUrl,
      set,
      shareUrl,
      storage,
      syncer,
      workspaceId
    }
  })
}

export async function getWorkspaces () {
  const prefix = 'documents/+oncheckin.'
  const ids = (await window.indexedDB.databases())
    .map(({ name }) => name)
    .filter((name) => name.startsWith(prefix))
    .map((name) => name.replace(prefix, ''))
  const workspacesPromises = ids.map(getWorkspace)
  return (await Promise.all(workspacesPromises))
    .sort(sortAsc('name'))
}

export function openWorkspace (id = null) {
  localStorage.setItem(CURRENT_WORKSPACE, JSON.stringify(id))
}

export async function renameWorkspace (name) {
  const { id, set } = await getWorkspace()
  await set(fileName, { name })
  workspaces.delete(id)
  return await getWorkspace()
}

export async function setContent (storage, path, content) {
  const keypair = getKeypair()
  const ext = parseExtension(path)
  const encode = extEncodeMap[ext]
  const tag = storage.tag()
  const write = storage.set(keypair, {
    format: 'es.4',
    path: resolvePath(path),
    content: encode(storage, path, content)
  })
  await tag
  return write
}

export async function setPub (id, pub) {
  const storage = getStorage(id)
  await storage.setConfig('pub', pub)
}

export async function syncStatus () {
  const { storage } = await workspaceStore.get()
  const lastLocalUpdate = await storage.getConfig('last-local-update')
  const lastRemoteUpdate = await storage.getConfig('last-remote-update')
  const lastSync = await storage.getConfig('last-sync')
  const unsyncedChanges = lastLocalUpdate > lastSync
  const day = isToday(lastSync) ? 'Today' : format(lastSync, 'PP')
  const time = format(lastSync, 'p')
  const lastSyncDisplay = lastSync ? `${day}, ${time}` : ''
  return {
    lastLocalUpdate,
    lastRemoteUpdate,
    lastSync,
    lastSyncDisplay,
    unsyncedChanges
  }
}

export async function syncWorkspace () {
  const syncer = await getSyncer()
  syncer.syncOnceAndContinueLive()
}

export async function syncWorkspaceOnce () {
  const { storage, syncer } = await workspaceStore.get()
  const tag = storage.tag()
  const stats = await syncer.syncOnce()
  if (stats.pull.numIngested > 0) {
    await tag
  }
  const lastSync = Date.now()
  await storage.setConfig('last-sync', lastSync)
  return { lastSync, stats }
}

const workspaceStore = {
  create: createWorkspace,
  get: getWorkspace,
  getAll: getWorkspaces,
  getStorage,
  open: openWorkspace,
  rename: renameWorkspace,
  setPub,
  sync: syncWorkspace,
  syncOnce: syncWorkspaceOnce,
  syncStatus: syncStatus
}

export default workspaceStore
