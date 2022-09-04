import { format, isBefore, sub } from 'date-fns'

export async function get ({ data }) {
  const { event } = data
  const h1 = event.name
  const returnersCutoff = ''
  const participants = []
  const template = { h1, returnersCutoff, participants }
  return { template }
}
