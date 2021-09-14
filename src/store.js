import { format } from 'date-fns'
import Gun from 'gun/gun.js'
import 'gun/sea.js' // Use users and encryption.
import 'gun/lib/radix.js' // Use Radix tree to speed up data lookups.
import 'gun/lib/radisk.js' // Use storage adapter.
import 'gun/lib/store.js' // Allow alternative storage options.
import 'gun/lib/rindexed.js' // Use IndexedDB for storage.

const { indexedDB, localStorage } = window
const sea = Gun.SEA
const LOGIN_KEY = 'oncheckin-key'
const DB_NAME = 'oncheckin-store'

export const store = Gun({
  file: DB_NAME,
  localStorage: false,
  peers: [
    'http://localhost:8765/gun'
  ]
})

export async function init () {
  const key = localStorage.getItem(LOGIN_KEY)
  if (key) {
    await login(JSON.parse(key))
  } else {
    await loginAsNewUser()
  }
}

export async function login (key) {
  localStorage.setItem(LOGIN_KEY, JSON.stringify(key))
  const auth = await authenticate(store.user(), key)
  console.log('LOGGED IN', auth)
  return auth
}

export async function loginAsNewUser () {
  const key = await sea.pair()
  await login(key)
}

export function authenticate (user, ...args) {
  return new Promise((resolve) => {
    user.auth(...args, (data) => {
      resolve(data)
    })
  })
}

export async function logout () {
  localStorage.removeItem(LOGIN_KEY)
  await clearIndexedDB()
  window.location = './'
}

function clearIndexedDB () {
  return new Promise((resolve) => {
    const d = indexedDB.deleteDatabase(DB_NAME)
    d.onsuccess = () => {
      resolve()
    }
  })
}

export async function createKey () {
  return Math.random().toString(36).substr(2, 9)
}

export async function append (g, value) {
  return new Promise((resolve) => {
    let ref = null
    ref = resolveChain(g).set(value, () => {
      resolve(ref)
    })
  })
}

export async function get (g, type) {
  return new Promise((resolve) => {
    const ref = resolveChain(g)
    ref.once(async (data, key) => {
      const upgradedData = await upgrade(data, type)
      resolve({ data: upgradedData, key, ref })
    })
  })
}

export async function getAll (g, type) {
  const a = await get(g)
  const b = Object.keys(a.data || {})
    .filter((key) => key !== '_')
    .map((key) => get([g, key], type))
  return await Promise.all(b)
}

export async function set (g, value) {
  return new Promise((resolve) => {
    resolveChain(g).put(value, () => {
      resolve(g)
    })
  })
}

const typeMap = {
  Attendance: upgradeAttendance,
  Event: upgradeEvent,
  Participant: upgradeParticipant
}

async function upgrade (data, type) {
  const upgrader = typeMap[type] ?? ((d) => d)
  return await upgrader(data)
}

async function upgradeAttendance (data) {
  const participant = await get(data.participant['#'], 'Participant')
  return { ...data, participant }
}

function upgradeEvent (data) {
  const displayDate = format(Date.parse(data.date), 'PP')
  return { ...data, displayDate }
}

function upgradeParticipant (data) {
  const { firstName, lastName } = data
  const fullName = `${firstName} ${lastName}`
  return { ...data, fullName }
}

function resolveChain (g) {
  if (Array.isArray(g)) {
    return g
      .reduce((acc, val) => Array.isArray(val) ? [...acc, ...val] : [...acc, val], [])
      .reduce((acc, val) => acc.get(val), store)
  }
  return typeof g === 'string' ? store.get(g) : g
}
