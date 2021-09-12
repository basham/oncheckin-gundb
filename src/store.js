import Gun from 'gun/gun.js'
import 'gun/nts.js' // Sync clocks across peers.
import 'gun/sea.js' // Use users and encryption.
import 'gun/lib/store.js' // Allow alternative storage options.
import 'gun/lib/rindexed.js' // Use IndexedDB for storage.
import 'gun/lib/then.js' // Use promises (async, await).

const { indexedDB, localStorage } = window
const sea = Gun.SEA
const LOGIN_KEY = 'oncheckin-key'
const DB_NAME = 'oncheckin-store'

export const store = Gun({
  file: DB_NAME,
  localStorage: false,
  peers: [
    'http://127.0.0.1:8765/gun',
    'http://192.168.7.99:8765/gun'
  ]
})

const mesh = store.back('opt.mesh')
const peers = store.back('opt.peers')
console.log('Peers', peers)
const dam = 'oncheckin'

setInterval(() => {
  mesh.say({ dam, d: Math.random() })
}, 5000)

mesh.hear[dam] = (msg, peer) => {
  console.log('HEAR', msg, peer)
}

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

export async function map (g) {
  const a = await g.then()
  const b = Object.keys(a || {})
    .filter((key) => key !== '_')
    .map((key) => g.get(key).promise())
  const c = await Promise.all(b)
  const d = c
    .map(({ get, put }) => {
      const { _, ...data } = put
      return { ...data, key: get }
    })
  return d
}
