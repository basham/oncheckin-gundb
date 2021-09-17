import cuid from 'cuid'
import { format, parseISO } from 'date-fns'
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

export function createRandomString (length) {
  return Math.random().toString(36).substr(2, length)
}

export async function createEvent (values) {
  return setEvent(cuid(), values)
}

export async function createParticipant (values) {
  return setParticipant(cuid(), values)
}

export function delay (ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

export function get (path) {
  return storage.getContent(resolvePath(path))
}

export function getEvent (id) {
  const name = get(`events/${id}/name.txt`)
  const date = get(`events/${id}/date.txt`)
  if ([name, date].some((item) => item === undefined)) {
    return undefined
  }
  const dateObj = parseISO(date)
  const displayDate = format(dateObj, 'PP')
  return {
    id,
    name,
    date,
    dateObj,
    displayDate
  }
}

export function getEvents () {
  const ids = storage
    .paths({ pathStartsWith: resolvePath('events') })
    .map((path) => path.split('/')[3])
  const uniqueIds = Array.from(new Set(ids))
  return uniqueIds
    .map(getEvent)
    .filter((item) => item)
    .sort((a, b) => {
      const [keyA, keyB] = [a, b]
        .map(({ dateObj }) => dateObj)
      return keyA < keyB ? 1 : keyA > keyB ? -1 : 0
    })
}

export function getParticipant (id) {
  const values = ['firstName', 'lastName']
    .map((key) => get(`participants/${id}/${key}.txt`))
  if (values.some((item) => item === undefined)) {
    return undefined
  }
  const [firstName, lastName] = values
  const fullName = `${firstName} ${lastName}`.trim()
  return {
    id,
    firstName,
    lastName,
    fullName
  }
}

export function getParticipants () {
  const ids = storage
    .paths({ pathStartsWith: resolvePath('participants') })
    .map((path) => path.split('/')[3])
  const uniqueIds = Array.from(new Set(ids))
  return uniqueIds
    .map(getParticipant)
    .filter((item) => item)
    .sort((a, b) => {
      const [keyA, keyB] = [a, b]
        .map(({ fullName }) => fullName)
      return keyA < keyB ? -1 : keyA > keyB ? 1 : 0
    })
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

export async function setEvent (id, values) {
  ['name', 'date']
    .map((key) => [`events/${id}/${key}.txt`, values[key]])
    .filter((item) => item[1] !== undefined)
    .forEach(([path, value]) => set(path, value))
  await delay(100)
}

export async function setParticipant (id, values) {
  ['firstName', 'lastName']
    .map((key) => [`participants/${id}/${key}.txt`, values[key]])
    .filter((item) => item[1] !== undefined)
    .forEach(([path, value]) => set(path, value))
  await delay(100)
}
