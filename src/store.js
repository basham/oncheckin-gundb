import Gun from 'gun/gun.js'
import 'gun/sea.js'
import 'gun/lib/store.js'
import 'gun/lib/rindexed.js'
import 'gun/lib/then.js'

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

export async function init () {
  const key = localStorage.getItem(LOGIN_KEY)
  if (key) {
    login(JSON.parse(key))
  } else {
    loginAsNewUser()
  }
}

export async function login (key) {
  localStorage.setItem(LOGIN_KEY, JSON.stringify(key))
  store.user().auth(key)
}

export async function loginAsNewUser () {
  const key = await sea.pair()
  const user = store.user()
  const auth = user.auth(key)
  // user.get('profile').get('name').put('test name')
  // const name = await user.get('profile').get('name')
  console.log('sea', auth)
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
