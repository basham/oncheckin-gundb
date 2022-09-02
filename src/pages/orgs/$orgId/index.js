import { getOrg, getEventYears, getPastEvents, getUpcomingEvents } from '@src/api.js'

export async function get ({ keys, route }) {
  route = `${route}/events`
  const h1 = 'Events'
  const { orgId } = keys
  const org = await getOrg(orgId)
  const upcomingEvents = await getUpcomingEvents(orgId)
  const recentEvents = (await getPastEvents(orgId)).slice(0, 5)
  const years = await getEventYears(orgId)
  const template = { route, h1, org, upcomingEvents, recentEvents, years }
  return { template }
}
