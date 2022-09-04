import { getEventCheckIns } from '@src/api.js'

export async function get ({ data }) {
  const { org, event } = data
  const h1 = event.name
  const checkIns = await getEventCheckIns(org.id, event.id)
  const hares = checkIns.filter(({ host }) => host)
  const runners = checkIns.filter(({ host }) => !host)
  const template = { h1, hares, runners }
  return { template }
}
