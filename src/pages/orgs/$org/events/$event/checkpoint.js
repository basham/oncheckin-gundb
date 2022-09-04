import { getEventCheckIns } from '@src/api.js'

export async function get ({ data }) {
  const { org, event } = data
  const h1 = event.name
  const h2 = 'Checkpoint'
  const runners = await getEventCheckIns(org.id, event.id)
  const template = { h1, h2, runners }
  return { template }
}
