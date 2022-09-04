export async function get ({ data }) {
  const { event } = data
  const h1 = event.name
  const h2 = 'New check-in'
  const participants = []
  const template = { h1, h2, participants }
  return { template }
}
