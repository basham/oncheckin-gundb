import { format, isFuture, isPast, isToday, parseISO } from 'date-fns'
import { Y } from './util.js'
import { getWorkspace } from './workspace.js'
import { createId, getOrCreate, sortDesc } from '../util.js'

const cache = new Map()

export async function createEvent (docId, values) {
  return await setEvent(docId, createId(), values)
}

export async function getEvent (docId, eventId) {
  return getOrCreate(cache, `${docId}/${eventId}`, async () => {
    const { events } = await getWorkspace(docId)
    if (!events.has(eventId)) {
      return undefined
    }
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
    const url = `?p=${docId}/events/${eventId}`
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

export async function getEvents (docId) {
  return getOrCreate(cache, `${docId}/events`, async () => {
    const { events } = await getWorkspace(docId)
    const promises = [...events.keys()]
      .map((eventId) => getEvent(docId, eventId))
    return (await Promise.all(promises))
      .filter((item) => item)
      .sort(sortDesc('dateObj'))
  })
}

export async function getPastEvents (docId) {
  return (await getEvents(docId))
    .filter(({ dateObj }) => !isToday(dateObj) && isPast(dateObj))
}

export async function getUpcomingEvents (docId) {
  return (await getEvents(docId))
    .filter(({ dateObj }) => isToday(dateObj) || isFuture(dateObj))
    .reverse()
}

export async function setEvent (docId, eventId, values) {
  const { events } = await getWorkspace(docId)
  const event = getOrCreate(events, eventId, () => new Y.Map())
  event.doc.transact(() => {
    for (const [key, value] of Object.entries(values)) {
      event.set(key, value)
    }
  })
  return await getEvent(docId, eventId)
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
