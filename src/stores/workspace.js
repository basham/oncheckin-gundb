import {
  OnePubOneWorkspaceSyncer,
  StorageLocalStorage,
  ValidatorEs4,
  checkAuthorKeypairIsValid,
  generateAuthorKeypair,
  isErr
} from 'earthstar/dist/earthstar.min.js'
import { createId } from './util.js'
import { APP } from '../constants.js'
import { delay, randomWord, sortAsc } from '../util.js'
const { localStorage } = window

const CURRENT_AUTHOR = `${APP}-current-author`
const CURRENT_WORKSPACE = `${APP}-current-workspace`
const WORKSPACES = `${APP}-workspaces`
const fileName = 'workspace.json'
const storages = new Map()
const syncers = new Map()

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

export function getContent (storage, path) {
  const ext = parseExtension(path)
  const decode = extDecodeMap[ext]
  const content = storage.getContent(resolvePath(path))
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
  if (!storages.has(id)) {
    const workspaceId = createWorkspaceId(id)
    storages.set(id, new StorageLocalStorage([ValidatorEs4], workspaceId))
  }
  return storages.get(id)
}

export function getSyncer (id = getCurrentWorkspaceId()) {
  if (!syncers.has(id)) {
    const storage = getStorage(id)
    const pub = getPub(id)
    syncers.set(id, new OnePubOneWorkspaceSyncer(storage, pub))
  }
  return syncers.get(id)
}

export function getWorkspace (id = getCurrentWorkspaceId()) {
  const storage = getStorage(id)
  const get = (path) => getContent(storage, path)
  const set = (path, content) => setContent(storage, path, content)
  const data = get(fileName) || {}
  const pub = getPub(id)
  const name = data.name || '(Workspace)'
  const openUrl = `?p=open-workspace&id=${id}`
  return {
    get,
    id,
    pub,
    name,
    openUrl,
    set
  }
}

export function getWorkspaceConfig () {
  return JSON.parse(localStorage.getItem(WORKSPACES)) || {}
}

export function getWorkspaces () {
  const config = getWorkspaceConfig()
  const ids = Object.keys(config)
  return ids
    .map(getWorkspace)
    .sort(sortAsc('name'))
}

export function openWorkspace (id = null) {
  localStorage.setItem(CURRENT_WORKSPACE, JSON.stringify(id))
}

export function parseExtension (path, defaultExtension = 'txt') {
  const extGroup = path.match(/\.(.+)$/)
  return extGroup ? extGroup[1] : defaultExtension
}

export function resolvePath (path = '') {
  const prefix = `/${APP}/`
  return path.startsWith(prefix) ? path : `${prefix}${path}`
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

const workspaceStore = {
  create: createWorkspace,
  get: getWorkspace,
  getAll: getWorkspaces,
  open: openWorkspace
}

export default workspaceStore
