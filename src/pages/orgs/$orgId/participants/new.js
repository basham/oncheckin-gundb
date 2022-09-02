import { createParticipant, getOrg } from '@src/api.js'

export async function get ({ keys }) {
  const h1 = 'New hasher'
  const { orgId } = keys
  const org = await getOrg(orgId)
  const template = { h1, org }
  return { template }
}

export async function post ({ keys, request }) {
  const { orgId } = keys
  const data = await request.formData()
  const fullName = data.get('fullName')
  const alias = data.get('alias')
  const { url: redirect } = await createParticipant(orgId, { fullName, alias })
  return { redirect }
}
