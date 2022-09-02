import { getEvent, getOrg } from '@src/api.js'

export async function get ({ keys }) {
  const { orgId, eventId } = keys
  const org = await getOrg(orgId)
  const event = await getEvent(orgId, eventId)
  const h1 = event.name
  const h2 = 'Checkpoint'
  const runners = []
  const template = { h1, h2, org, event, runners }
  return { template }
}
