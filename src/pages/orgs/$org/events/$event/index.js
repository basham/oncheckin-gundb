export async function get ({ data }) {
  const { event } = data
  const h1 = event.name
  const hares = []
  const runners = []
  const template = { h1, hares, runners }
  return { template }
}
