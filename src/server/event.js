import { format, isFuture, isPast, isToday, parseISO } from 'date-fns'
import { getOrg, getOrgDB } from './org.js'
import { createYMap } from './store.js'
import { createId } from './util.js'
import { getOrCreate, sortDesc } from '@src/util.js'

const cache = new Map()

export async function createEvent (orgId, values) {
  return await setEvent(orgId, createId(), values)
}

export async function getEvent (orgId, eventId) {
  return getOrCreate(cache, `${orgId}/${eventId}`, async () => {
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

export async function getEvents (orgId) {
  return getOrCreate(cache, `${orgId}/events`, async () => {
    const db = await getOrgDB(orgId)
    const events = []
    for (const eventId of [...db.events.keys()]) {
      const event = await getEvent(orgId, eventId)
      events.push(event)
    }
    return events.sort(sortDesc('dateObj'))
  })
}

export async function getPastEvents (orgId) {
  return (await getEvents(orgId))
    .filter(({ dateObj }) => !isToday(dateObj) && isPast(dateObj))
}

export async function getUpcomingEvents (orgId) {
  return (await getEvents(orgId))
    .filter(({ dateObj }) => isToday(dateObj) || isFuture(dateObj))
    .reverse()
}

export async function getEventYears (orgId) {
  const years = (await getEvents(orgId))
    .map(({ year }) => year)
  return [...(new Set(years))].sort().reverse()
}

export async function getEventsByYear (orgId, year) {
  return (await getEvents(orgId))
    .filter((event) => event.year === year)
    .reverse()
}

export async function setEvent (orgId, eventId, values) {
  cache.delete(`${orgId}/events`)
  cache.delete(`${orgId}/${eventId}`)
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
  getAll: getEvents,
  getPast: getPastEvents,
  getUpcoming: getUpcomingEvents,
  set: setEvent
}

export default event
