import { getOrg } from '@src/server/org.js'
import { getParticipants } from '@src/server/participant.js'

export async function get ({ keys }) {
  const h1 = 'Hashers'
  const { orgId } = keys
  const org = await getOrg(orgId)
  const participants = await getParticipants(orgId)
  const template = { h1, org, participants }
  return { template }
}
