import { addOrg, createOrg, getCurrentAccountId } from '@src/api.js'

export async function get () {
  const h1 = 'New organization'
  const template = { h1 }
  return { template }
}

export async function post ({ request }) {
  const data = await request.formData()
  const name = data.get('name')
  const { id, url: redirect } = await createOrg({ name })
  const accountId = await getCurrentAccountId()
  await addOrg(accountId, id)
  return { redirect }
}
