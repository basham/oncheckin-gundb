import { getOrg, getParticipants } from '@src/api.js'

export async function get ({ keys }) {
  const h1 = 'Hashers'
  const { orgId } = keys
  const org = await getOrg(orgId)
  const participants = await getParticipants(orgId)
  const template = { h1, org, participants }
  return { template }
}
