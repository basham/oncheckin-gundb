import { format, isFuture, isPast, isToday, parseISO } from 'date-fns'
import { Y } from './util.js'
import { getWorkspace } from './workspace.js'
import { createId, getOrCreate, sortDesc } from '../util.js'

const cache = new Map()

export async function createEvent (values) {
  return await setEvent(createId(), values)
}

export async function getEvent (id) {
  return getOrCreate(cache, id, async () => {
    const { events } = await getWorkspace()
    if (!events.has(id)) {
      return undefined
    }
    const data = events.get(id)
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
    const url = `?p=events/${id}`
    return {
      id,
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

export async function getEvents () {
  return getOrCreate(cache, 'events', async () => {
    const { events } = await getWorkspace()
    const promises = [...events.keys()]
      .map(getEvent)
    return (await Promise.all(promises))
      .filter((item) => item)
      .sort(sortDesc('dateObj'))
  })
}

export async function getPastEvents () {
  return (await getEvents())
    .filter(({ dateObj }) => !isToday(dateObj) && isPast(dateObj))
}

export async function getUpcomingEvents () {
  return (await getEvents())
    .filter(({ dateObj }) => isToday(dateObj) || isFuture(dateObj))
    .reverse()
}

export async function setEvent (id, values) {
  const { events } = await getWorkspace()
  const event = getOrCreate(events, id, () => new Y.Map())
  event.doc.transact(() => {
    for (const [key, value] of Object.entries(values)) {
      event.set(key, value)
    }
  })
  return getEvent(id)
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
