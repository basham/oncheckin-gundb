import { getEvent, setEvent } from '@src/server/event.js'
import { getOrg } from '@src/server/org.js'

export async function get ({ keys, route }) {
  const { orgId, eventId } = keys
  const org = await getOrg(orgId)
  const event = await getEvent(orgId, eventId)
  const h1 = event.name
  const h2 = 'Edit event'
  const template = { route, h1, h2, org, event }
  return { template }
}

export async function post ({ keys, request }) {
  const { orgId, eventId } = keys
  const data = await request.formData()
  const name = data.get('name')
  const date = data.get('date')
  const count = data.get('count')
  const { url: redirect } = await setEvent(orgId, eventId, { name, date, count })
  return { redirect }
}
