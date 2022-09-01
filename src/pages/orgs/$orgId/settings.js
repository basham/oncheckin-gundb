import { getOrg } from '@src/server/org.js'

export async function get ({ keys }) {
  const h1 = 'Settings'
  const { orgId } = keys
  const org = await getOrg(orgId)
  const template = { h1, org, orgId }
  return { template }
}
