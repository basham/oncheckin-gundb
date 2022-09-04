export async function get ({ data }) {
  const { event } = data
  const h1 = event.name
  const h2 = 'Checkpoint'
  const runners = []
  const template = { h1, h2, runners }
  return { template }
}
