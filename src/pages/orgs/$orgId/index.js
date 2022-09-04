import { getEventYears, getPastEvents, getUpcomingEvents } from '@src/api.js'

export async function get ({ data }) {
  const { org } = data
  const route = `${data.route}/events`
  const h1 = 'Events'
  const upcomingEvents = await getUpcomingEvents(org.id)
  const recentEvents = (await getPastEvents(org.id)).slice(0, 5)
  const years = await getEventYears(org.id)
  const template = { route, h1, upcomingEvents, recentEvents, years }
  return { template }
}
