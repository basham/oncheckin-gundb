import { getOrg, renameOrg } from '@src/server/org.js'

export async function get ({ keys }) {
  const h1 = 'Rename organization'
  const { orgId } = keys
  const org = await getOrg(orgId)
  const template = { h1, org, orgId }
  return { template }
}

export async function post ({ keys, request }) {
  const { orgId } = keys
  const data = await request.formData()
  const name = data.get('name')
  await renameOrg(orgId, name)
  const org = await getOrg(orgId)
  const redirect = `${org.url}settings`
  return { redirect }
}
