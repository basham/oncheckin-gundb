import { createEvent, getOrg } from '@src/api.js'
import { todayDate } from '@src/util.js'

export async function get ({ keys }) {
  const h1 = 'New event'
  const { orgId } = keys
  const org = await getOrg(orgId)
  const date = todayDate()
  const template = { h1, org, date }
  return { template }
}

export async function post ({ keys, request }) {
  const { orgId } = keys
  const data = await request.formData()
  const name = data.get('name')
  const date = data.get('date')
  const count = data.get('count')
  const { url: redirect } = await createEvent(orgId, { name, date, count })
  return { redirect }
}
