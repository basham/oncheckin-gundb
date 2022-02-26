import { format, isToday } from 'date-fns'
import { Crypto, FormatValidatorEs4, Peer, Replica, isErr } from 'earthstar'
import { ReplicaDriver, localStorage, btoa } from './storage.js'
import { APP, URL } from '../constants.js'
import { createId, getOrCreate, parseExtension, randomWord, resolvePath, sortAsc } from '../util.js'

const CURRENT_AUTHOR = `${APP}-current-author`
const CURRENT_WORKSPACE = `${APP}-current-workspace`
const fileName = 'workspace.json'
const cache = new Map()

const extDecodeMap = {
  json: (content) => JSON.parse(content),
  txt: (content) => content
}

const extEncodeMap = {
  json: async (replica, path, content) => {
    if (content === '') {
      return content
    }
    const doc = await getDoc(replica, path)
    return JSON.stringify({
      ...(doc || {}),
      ...content
    })
  },
  txt: async (replica, path, content) => content
}

export async function createWorkspace ({ name, pub = null }) {
  const id = createId()
  const replica = getReplica(id)
  await setPub(id, pub)
  await setDoc(replica, fileName, { name })
  const confirmationUrl = `?p=workspaces/created/${id}`
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

export async function getDoc (replica, path) {
  const ext = parseExtension(path)
  const decode = extDecodeMap[ext]
  const content = await replica.getLatestDocAtPath(resolvePath(path))
  console.log('CC', path, content)
  return content ? decode(content) : undefined
}

export function getCurrentWorkspaceId () {
  return JSON.parse(localStorage.getItem(CURRENT_WORKSPACE))
}

export async function getKeypair () {
  const storedKeypair = JSON.parse(localStorage.getItem(CURRENT_AUTHOR))
  const check = await Crypto.checkAuthorKeypairIsValid(storedKeypair)

  if (!isErr(check)) {
    return storedKeypair
  }

  const shortname = randomWord(4)
  const keypair = await Crypto.generateAuthorKeypair(shortname)
  localStorage.setItem(CURRENT_AUTHOR, JSON.stringify(keypair))
  return keypair
}

export function getReplica (id = getCurrentWorkspaceId()) {
  return getOrCreate(cache, `replica/${id}`, () => {
    const workspaceId = createWorkspaceId(id)
    return new Replica(workspaceId, FormatValidatorEs4, new ReplicaDriver(workspaceId))
  })
}

export function getPeer (id = getCurrentWorkspaceId()) {
  return getOrCreate(cache, `peer/${id}`, async () => {
    const replica = getReplica(id)
    const peer = new Peer()
    peer.addReplica(replica)
    // const pub = await replica.getConfig('pub')
    // peer.sync(pub)
    return peer
  })
}

export function getWorkspace (id = getCurrentWorkspaceId()) {
  return getOrCreate(cache, `workspace/${id}`, async () => {
    const workspaceId = createWorkspaceId(id)
    const replica = getReplica(id)
    const peer = await getPeer(id)
    const get = (path) => getDoc(replica, path)
    const set = (path, content) => setDoc(replica, path, content)
    const data = (await get(fileName)) || {}
    const pub = await replica.getConfig('pub')
    const name = data.name || '(Workspace)'
    const openUrl = `?p=workspaces/open/${id}`
    const inviteCode = btoa(JSON.stringify({ id, name, pub }))
    const shareUrl = `${URL}?p=workspaces/join/${inviteCode}`
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
      peer,
      replica,
      set,
      shareUrl,
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
    .filter((name) => name !== 'null')
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
  cache.delete(`workspace/${id}`)
  return await getWorkspace()
}

export async function setDoc (replica, path, value) {
  const keypair = await getKeypair()
  const ext = parseExtension(path)
  const encode = extEncodeMap[ext]
  const content = await encode(replica, path, value)
  console.log('##', keypair, path, content)
  await replica.set(keypair, {
    format: 'es.4',
    path: resolvePath(path),
    content
  })
}

export async function setPub (id, pub) {
  const replica = getReplica(id)
  await replica.setConfig('pub', pub)
}

export async function syncStatus () {
  const { replica } = await workspaceStore.get()
  const lastLocalUpdate = await replica.getConfig('last-local-update')
  const lastRemoteUpdate = await replica.getConfig('last-remote-update')
  const lastSync = await replica.getConfig('last-sync')
  const unsyncedChanges = lastLocalUpdate > lastSync
  const day = '' // isToday(lastSync) ? 'Today' : format(lastSync, 'PP')
  const time = '' // format(lastSync, 'p')
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
  // const syncer = await getSyncer()
  // syncer.syncOnceAndContinueLive()
}

export async function syncWorkspaceOnce () {
  /*
  const { storage, syncer } = await workspaceStore.get()
  const tag = storage.tag()
  const stats = await syncer.syncOnce()
  if (stats.pull.numIngested > 0) {
    await tag
  }
  const lastSync = Date.now()
  await storage.setConfig('last-sync', lastSync)
  */
  return { lastSync: Date.now(), stats: {} }
}

const workspaceStore = {
  create: createWorkspace,
  get: getWorkspace,
  getAll: getWorkspaces,
  getReplica,
  open: openWorkspace,
  rename: renameWorkspace,
  setPub,
  sync: syncWorkspace,
  syncOnce: syncWorkspaceOnce,
  syncStatus: syncStatus
}

export default workspaceStore
