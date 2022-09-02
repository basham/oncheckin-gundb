import { getEventsByYear, getOrg } from '@src/api.js'

export async function get ({ keys }) {
  const { orgId, year } = keys
  const h1 = `Events in ${year}`
  const org = await getOrg(orgId)
  const events = await getEventsByYear(orgId, year)
  const template = { h1, org, events }
  return { template }
}
