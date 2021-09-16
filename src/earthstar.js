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
const storage = new StorageLocalStorage([ValidatorEs4], workspace)

console.log('ES', earthstar)

const keypair = getKeypair()
console.log(keypair)

const path = '/oncheckin/test.txt'
const write = storage.set(keypair, {
  format: 'es.4',
  path,
  content: 'Hello'
})
const content = storage.getContent(path)

console.log(write, content)

const pub = 'http://localhost:3333'
const syncer = new OnePubOneWorkspaceSyncer(storage, pub)

syncer.syncOnceAndContinueLive()

export function createRandomString (length) {
  return Math.random().toString(36).substr(2, length)
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
