import { getOrg } from '@src/server/org.js'

export async function get ({ keys, route }) {
  const h1 = 'Settings'
  const { orgId } = keys
  const org = await getOrg(orgId)
  const template = { route, h1, org, orgId }
  return { template }
}
