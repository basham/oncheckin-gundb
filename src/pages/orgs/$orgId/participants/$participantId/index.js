export async function get ({ data }) {
  const { participant } = data
  const h1 = participant.displayName
  const checkIns = []
  const latestCheckIn = null
  const template = { h1, checkIns, latestCheckIn }
  return { template }
}
