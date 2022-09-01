import { getEventsByYear } from '@src/server/event.js'
import { getOrg } from '@src/server/org.js'

export async function get ({ keys, route }) {
  const { orgId, year } = keys
  const h1 = `Events in ${year}`
  const org = await getOrg(orgId)
  const events = await getEventsByYear(orgId, year)
  const template = { route, h1, org, events }
  return { template }
}
