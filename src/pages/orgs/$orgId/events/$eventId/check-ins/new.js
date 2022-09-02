import { getEvent, getOrg } from '@src/api.js'

export async function get ({ keys }) {
  const { orgId, eventId } = keys
  const org = await getOrg(orgId)
  const event = await getEvent(orgId, eventId)
  const h1 = event.name
  const h2 = 'New check-in'
  const participants = []
  const template = { h1, h2, org, event, participants }
  return { template }
}
