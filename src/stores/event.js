import { format, isFuture, isPast, isToday, parseISO } from 'date-fns'
import { getWorkspace } from './workspace.js'
import { createId, resolvePath, sortDesc } from '../util.js'

const fileName = 'event.json'

export async function createEvent (values) {
  return await setEvent(createId(), values)
}

export async function getEvent (id) {
  const { get } = await getWorkspace()
  const data = await get(`${id}/${fileName}`)
  if (!data) {
    return undefined
  }
  const dateObj = parseISO(data.date)
  const displayDate = format(dateObj, 'PP')
  const displayDateLong = format(dateObj, 'E, PP')
  const name = data.name.trim() || '(Event)'
  const url = `?p=event&id=${id}`
  return {
    ...data,
    id,
    dateObj,
    displayDate,
    displayDateLong,
    name,
    url
  }
}

export async function getEvents () {
  const { storage } = await getWorkspace()
  const ids = storage
    .paths({
      pathStartsWith: resolvePath(),
      pathEndsWith: fileName
    })
    .map((path) => path.split('/')[2])
  const uniqueIds = Array.from(new Set(ids))
  const eventPromises = uniqueIds
    .map(getEvent)
  return (await Promise.all(eventPromises))
    .filter((item) => item)
    .sort(sortDesc('dateObj'))
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
  const { set } = await getWorkspace()
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
