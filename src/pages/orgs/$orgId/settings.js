import { getOrg } from '@src/api.js'

export async function get ({ keys }) {
  const h1 = 'Settings'
  const { orgId } = keys
  const org = await getOrg(orgId)
  const template = { h1, org, orgId }
  return { template }
}
