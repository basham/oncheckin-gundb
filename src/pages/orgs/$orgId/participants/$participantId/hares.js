import { getOrg } from '@src/server/org.js'
import { getParticipant } from '@src/server/participant.js'

export async function get ({ keys }) {
  const { orgId, participantId } = keys
  const org = await getOrg(orgId)
  const participant = await getParticipant(orgId, participantId)
  const h1 = participant.displayName
  const checkIns = []
  const template = { h1, org, participant, checkIns }
  return { template }
}
