export async function get ({ data }) {
  const { event } = data
  const h1 = event.name
  const h2 = 'Circle'
  const checkIns = []
  const template = { h1, h2, checkIns }
  return { template }
}
