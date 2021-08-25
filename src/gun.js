import Gun from 'gun/gun'
import 'gun/lib/then.js'

export const gun = Gun()
export default Gun

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
