import { createId } from '@src/server/util.js'

export async function get () {
  const json = { id: createId() }
  return { json }
}
