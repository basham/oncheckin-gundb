import cuid from 'cuid'
import {
  OnePubOneWorkspaceSyncer,
  StorageLocalStorage,
  ValidatorEs4,
  checkAuthorKeypairIsValid,
  generateAuthorKeypair,
  isErr
} from 'earthstar/dist/earthstar.min.js'
import { delay, randomWord } from '../util.js'
const { localStorage } = window

const APP = 'oncheckin'
const CURRENT_AUTHOR = `${APP}-current-author`
const workspace = '+bfh3.hhh1997'
const pub = 'https://oncheckin-pub.glitch.me/'

export const storage = new StorageLocalStorage([ValidatorEs4], workspace)
export const syncer = new OnePubOneWorkspaceSyncer(storage, pub)
syncer.syncOnceAndContinueLive()

const extDecodeMap = {
  json: (content) => JSON.parse(content),
  txt: (content) => content
}

const extEncodeMap = {
  json: (path, content) => {
    if (content === '') {
      return content
    }
    return JSON.stringify({
      ...(get(path) || {}),
      ...content
    })
  },
  txt: (path, content) => content
}

export function createId () {
  return cuid()
}

export function createWorkspaceId (id = createId()) {
  return `+${APP}.${id}`
}

export function get (path) {
  const ext = parseExtension(path)
  const decode = extDecodeMap[ext]
  const content = storage.getContent(resolvePath(path))
  return content ? decode(content) : undefined
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

function parseExtension (path, defaultExtension = 'txt') {
  const extGroup = path.match(/\.(.+)$/)
  return extGroup ? extGroup[1] : defaultExtension
}

export function resolvePath (path = '') {
  const prefix = `/${APP}/`
  return path.startsWith(prefix) ? path : `${prefix}${path}`
}

export async function set (path, content) {
  const keypair = getKeypair()
  const ext = parseExtension(path)
  const encode = extEncodeMap[ext]
  const write = storage.set(keypair, {
    format: 'es.4',
    path: resolvePath(path),
    content: encode(path, content)
  })
  await delay(100)
  return write
}
