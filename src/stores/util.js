import cuid from 'cuid'
import earthstar, {
  OnePubOneWorkspaceSyncer,
  StorageLocalStorage,
  ValidatorEs4,
  checkAuthorKeypairIsValid,
  generateAuthorKeypair,
  isErr
} from 'earthstar/dist/earthstar.min.js'
const { localStorage } = window

const APP = 'oncheckin'
const USER_KEYPAIR = `${APP}-keypair`
const workspace = '+bfh3.hhh1997'
const pub = 'http://192.168.7.99:3333'

export const storage = new StorageLocalStorage([ValidatorEs4], workspace)
const syncer = new OnePubOneWorkspaceSyncer(storage, pub)
syncer.syncOnceAndContinueLive()

console.log('ES', earthstar)

const extDecodeMap = {
  json: (d) => JSON.parse(d),
  txt: (d) => d
}

const extEncodeMap = {
  json: (d) => JSON.stringify(d),
  txt: (d) => d
}

export function createId () {
  return cuid()
}

export function createRandomString (length) {
  return Math.random().toString(36).substr(2, length)
}

export function delay (ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

export function get (path) {
  const ext = parseExtension(path)
  const decode = extDecodeMap[ext]
  const content = storage.getContent(resolvePath(path))
  return content ? decode(content) : undefined
}

export function getKeypair () {
  const storedKeypair = JSON.parse(localStorage.getItem(USER_KEYPAIR))
  const check = checkAuthorKeypairIsValid(storedKeypair)
  if (!isErr(check)) {
    return storedKeypair
  }

  const shortname = createRandomString(4)
  const keypair = generateAuthorKeypair(shortname)
  localStorage.setItem(USER_KEYPAIR, JSON.stringify(keypair))
  return keypair
}

function parseExtension (path, defaultExtension = 'txt') {
  const extGroup = path.match(/\.(.+)$/)
  return extGroup ? extGroup[1] : defaultExtension
}

export function resolvePath (path = '') {
  return `/${APP}/${path}`
}

export async function set (path, content) {
  const keypair = getKeypair()
  const ext = parseExtension(path)
  const encode = extEncodeMap[ext]
  const write = storage.set(keypair, {
    format: 'es.4',
    path: resolvePath(path),
    content: encode(content)
  })
  await delay(100)
  return write
}

export async function setJSON (path, values) {
  const fullPath = `${path}.json`
  return await set(fullPath, {
    ...(get(fullPath) || {}),
    ...values
  })
}
