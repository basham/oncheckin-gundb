export async function get ({ data }) {
  const { event } = data
  const h1 = event.name
  const h2 = 'Edit check-in'
  const participant = null
  const host = false
  const template = { h1, h2, participant, host }
  return { template }
}
