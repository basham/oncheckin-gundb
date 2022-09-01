import { getEvent } from '@src/server/event.js'
import { getOrg } from '@src/server/org.js'

export async function get ({ keys, route }) {
  const { orgId, eventId } = keys
  const org = await getOrg(orgId)
  const event = await getEvent(orgId, eventId)
  const h1 = event.name
  const hares = []
  const runners = []
  const template = { route, h1, org, event, hares, runners }
  return { template }
}
