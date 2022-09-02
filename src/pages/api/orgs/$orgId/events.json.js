import { getEvents } from '@src/api.js'

export async function get ({ keys }) {
  const { orgId } = keys
  const json = await getEvents(orgId)
  return { json }
}