import { getOrg, getParticipant, setParticipant } from '@src/api.js'

export async function get ({ keys }) {
  const { orgId, participantId } = keys
  const org = await getOrg(orgId)
  const participant = await getParticipant(orgId, participantId)
  const h1 = participant.displayName
  const h2 = 'Edit participant'
  const template = { h1, h2, org, participant }
  return { template }
}

export async function post ({ keys, request }) {
  const { orgId, participantId } = keys
  const data = await request.formData()
  const fullName = data.get('fullName')
  const alias = data.get('alias')
  const location = data.get('location')
  const notes = data.get('notes')
  const { url: redirect } = await setParticipant(orgId, participantId, { fullName, alias, location, notes })
  return { redirect }
}
