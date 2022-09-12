import { addOrg, createOrg } from '@src/api.js'

export async function get ({ data }) {
  const h1 = 'Join organization'
  const code = JSON.parse(self.atob(data.code))
  const template = { h1, code }
  return { template }
}

export async function post ({ data, request }) {
  const { account } = data
  const formData = await request.formData()
  const id = formData.get('id')
  const { url } = await createOrg(id)
  await addOrg(account.id, id)
  const redirect = `${url}sync/`
  return { redirect }
}
