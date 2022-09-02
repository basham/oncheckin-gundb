import { getOrg } from '@src/api.js'

export async function get ({ keys }) {
  const { orgId } = keys
  const json = await getOrg(orgId)
  return { json }
}
