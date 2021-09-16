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
const pub = 'http://localhost:3333'

const storage = new StorageLocalStorage([ValidatorEs4], workspace)
const syncer = new OnePubOneWorkspaceSyncer(storage, pub)
syncer.syncOnceAndContinueLive()

const path = 'test.txt'
const write = set(path, 'Hello worlder')
const content = get(path)

console.log('ES', earthstar)
console.log(write, content)

export function createRandomString (length) {
  return Math.random().toString(36).substr(2, length)
}

export function get (path) {
  return storage.getContent(resolvePath(path))
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

export function logout () {
  localStorage.removeItem(USER_KEYPAIR)
  window.location = './'
}

function resolvePath (path) {
  return `/${APP}/${path}`
}

export function set (path, content) {
  const keypair = getKeypair()
  return storage.set(keypair, {
    format: 'es.4',
    path: resolvePath(path),
    content
  })
}
