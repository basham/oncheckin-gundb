import Gun from 'gun/gun.js'
import 'gun/sea.js'
// import 'gun/lib/store.js'
// import 'gun/lib/rindexed.js'
import 'gun/lib/then.js'

export const store = Gun({
  // file: 'oncheckin-store',
  // localStorage: true,
  peers: [
    'http://127.0.0.1:8765/gun',
    'http://192.168.7.99:8765/gun'
  ]
})

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
