import { getEvent, getOrg } from '@src/api.js'

export async function get ({ keys }) {
  const { orgId, eventId, participantId } = keys
  const org = await getOrg(orgId)
  const event = await getEvent(orgId, eventId)
  const h1 = event.name
  const h2 = 'Edit check-in'
  const participant = null
  const host = false
  const template = { h1, h2, org, event, participant, host }
  return { template }
}
