import {
  OnePubOneWorkspaceSyncer,
  ValidatorEs4,
  checkAuthorKeypairIsValid,
  generateAuthorKeypair,
  isErr
} from 'earthstar/dist/earthstar.min.js'
import { EarthstarStorage, localStorage, btoa } from './storage.js'
import { APP, URL } from '../constants.js'
import { createId, delay, getOrCreate, parseExtension, randomWord, resolvePath, sortAsc } from '../util.js'

const CURRENT_AUTHOR = `${APP}-current-author`
const CURRENT_WORKSPACE = `${APP}-current-workspace`
const WORKSPACES = `${APP}-workspaces`
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
  setPub(id, pub)
  const storage = getStorage(id)
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

export function getPub (id = getCurrentWorkspaceId()) {
  const workspaces = getWorkspaceConfig()
  return workspaces[id]
}

export function getStorage (id = getCurrentWorkspaceId()) {
  return getOrCreate(storages, id, () => {
    const workspaceId = createWorkspaceId(id)
    return new EarthstarStorage([ValidatorEs4], workspaceId)
  })
}

export function getSyncer (id = getCurrentWorkspaceId()) {
  return getOrCreate(syncers, id, () => {
    const storage = getStorage(id)
    const pub = getPub(id)
    return new OnePubOneWorkspaceSyncer(storage, pub)
  })
}

export function getWorkspace (id = getCurrentWorkspaceId()) {
  return getOrCreate(workspaces, id, async () => {
    const storage = getStorage(id)
    const syncer = getSyncer(id)
    const get = (path) => getContent(storage, path)
    const set = (path, content) => setContent(storage, path, content)
    const data = await get(fileName) || {}
    const pub = getPub(id)
    const name = data.name || '(Workspace)'
    const openUrl = `?p=open-workspace&id=${id}`
    const inviteCode = btoa(JSON.stringify({ id, name, pub }))
    const shareUrl = `${URL}?p=join&code=${inviteCode}`
    return {
      get,
      id,
      pub,
      name,
      openUrl,
      set,
      shareUrl,
      storage,
      syncer
    }
  })
}

export function getWorkspaceConfig () {
  return JSON.parse(localStorage.getItem(WORKSPACES)) || {}
}

export async function getWorkspaces () {
  const config = getWorkspaceConfig()
  const ids = Object.keys(config)
  const workspacesPromises = ids.map(getWorkspace)
  return (await Promise.all(workspacesPromises))
    .sort(sortAsc('name'))
}

export function openWorkspace (id = null) {
  localStorage.setItem(CURRENT_WORKSPACE, JSON.stringify(id))
}

export async function renameWorkspace (name) {
  const { id, set } = getWorkspace()
  await set(fileName, { name })
  workspaces.delete(id)
  return getWorkspace()
}

export async function setContent (storage, path, content) {
  const keypair = getKeypair()
  const ext = parseExtension(path)
  const encode = extEncodeMap[ext]
  const write = storage.set(keypair, {
    format: 'es.4',
    path: resolvePath(path),
    content: encode(storage, path, content)
  })
  await delay(100)
  return write
}

export function setPub (id, pub) {
  const workspaces = getWorkspaceConfig()
  const newWorkspaces = {
    ...workspaces,
    [id]: pub
  }
  localStorage.setItem(WORKSPACES, JSON.stringify(newWorkspaces))
}

export function syncWorkspace () {
  const syncer = getSyncer()
  syncer.syncOnceAndContinueLive()
}

export function syncWorkspaceOnce () {
  const syncer = getSyncer()
  return syncer.syncOnce()
}

const workspaceStore = {
  create: createWorkspace,
  get: getWorkspace,
  getAll: getWorkspaces,
  getStorage,
  getSyncer,
  open: openWorkspace,
  rename: renameWorkspace,
  setPub,
  sync: syncWorkspace,
  syncOnce: syncWorkspaceOnce
}

export default workspaceStore
