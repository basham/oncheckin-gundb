import { format, isFuture, isPast, isToday, parseISO } from 'date-fns'
import { createId, get, resolvePath, set, sortDesc, storage } from './util.js'

const fileName = 'event.json'

export async function createEvent (values) {
  return await setEvent(createId(), values)
}

export function getEvent (id) {
  const data = get(`${id}/${fileName}`)
  if (!data) {
    return undefined
  }
  const dateObj = parseISO(data.date)
  const displayDate = format(dateObj, 'PP')
  const name = data.name.trim() || '(Event)'
  const url = `?p=event&id=${id}`
  return {
    ...data,
    id,
    dateObj,
    displayDate,
    name,
    url
  }
}

export function getEvents () {
  const ids = storage
    .paths({
      pathStartsWith: resolvePath(),
      pathEndsWith: fileName
    })
    .map((path) => path.split('/')[2])
  const uniqueIds = Array.from(new Set(ids))
  return uniqueIds
    .map(getEvent)
    .filter((item) => item)
    .sort(sortDesc('dateObj'))
}

export function getPastEvents () {
  return getEvents()
    .filter(({ dateObj }) => !isToday(dateObj) && isPast(dateObj))
}

export function getUpcomingEvents () {
  return getEvents()
    .filter(({ dateObj }) => isToday(dateObj) || isFuture(dateObj))
    .reverse()
}

export async function setEvent (id, values) {
  await set(`${id}/${fileName}`, values)
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
