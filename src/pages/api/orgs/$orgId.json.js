import { getOrg } from '@src/server/org.js'

export async function get ({ keys }) {
  const { orgId } = keys
  const json = await getOrg(orgId)
  return { json }
}
