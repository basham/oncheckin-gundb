import { format, parseISO } from 'date-fns'
import { getOrCreate } from '@src/util.js'
import { getOrg, getOrgDB } from './org.js'
import { cache, createId, createYMap } from './store.js'

export async function createEvent (orgId, values) {
  return await setEvent(orgId, createId(), values)
}

export async function getEvent (orgId, eventId) {
  return getOrCreate(cache, `event:${orgId}/${eventId}`, async () => {
    const { events } = await getOrgDB(orgId)
    if (!events.has(eventId)) {
      return undefined
    }
    const org = await getOrg(orgId)
    const data = events.get(eventId)
    const count = data.get('count') || ''
    const date = data.get('date')
    if (!date) {
      return undefined
    }
    const dateObj = parseISO(date)
    const displayDate = format(dateObj, 'PP')
    const displayDateMedium = format(dateObj, 'E, MMM d')
    const displayDateLong = format(dateObj, 'E, PP')
    const year = format(dateObj, 'y')
    const name = data.get('name').trim() || '(Event)'
    const url = `${org.url}events/${eventId}/`
    return {
      id: eventId,
      count,
      date,
      dateObj,
      displayDate,
      displayDateMedium,
      displayDateLong,
      name,
      url,
      year
    }
  })
}

export async function setEvent (orgId, eventId, values) {
  cache.delete(`events:${orgId}`)
  cache.delete(`event:${orgId}/${eventId}`)
  const { events } = await getOrgDB(orgId)
  const event = getOrCreate(events, eventId, createYMap)
  event.doc.transact(() => {
    for (const [key, value] of Object.entries(values)) {
      event.set(key, value)
    }
  })
  return await getEvent(orgId, eventId)
}

const event = {
  create: createEvent,
  get: getEvent,
  set: setEvent
}

export default event
