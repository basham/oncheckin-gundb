import { getOrg, getParticipant } from '@src/api.js'

export async function get ({ keys }) {
  const { orgId, participantId } = keys
  const org = await getOrg(orgId)
  const participant = await getParticipant(orgId, participantId)
  const h1 = participant.displayName
  const checkIns = []
  const latestCheckIn = null
  const template = { h1, org, participant, checkIns, latestCheckIn }
  return { template }
}
