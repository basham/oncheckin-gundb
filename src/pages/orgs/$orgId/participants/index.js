import { getParticipants } from '@src/api.js'

export async function get ({ data }) {
  const { org } = data
  const h1 = 'Hashers'
  const participants = await getParticipants(org.id)
  const template = { h1, participants }
  return { template }
}
