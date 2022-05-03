import { format, isFuture, isPast, isToday, parseISO } from 'date-fns'
import { getWorkspace, parseDoc } from './workspace.js'
import { createId, getOrCreate, resolvePath, sortDesc } from '../util.js'

const fileName = 'event.json'
const cache = new Map()

export async function createEvent (values) {
  return await setEvent(createId(), values)
}

export async function getEvent (id) {
  return getOrCreate(cache, id, async () => {
    const { get } = await getWorkspace()
    const path = getPath(id)
    const data = cache.get(path) || await get(path)
    if (!data) {
      return undefined
    }
    const dateObj = parseISO(data.date)
    const displayDate = format(dateObj, 'PP')
    const displayDateMedium = format(dateObj, 'E, MMM d')
    const displayDateLong = format(dateObj, 'E, PP')
    const year = format(dateObj, 'y')
    const name = data.name.trim() || '(Event)'
    const url = `?p=events/${id}`
    return {
      ...data,
      id,
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
    const { replica } = await getWorkspace()
    const docs = await replica.queryDocs({
      historyMode: 'latest',
      filter: {
        pathEndsWith: fileName,
        pathStartsWith: resolvePath()
      }
    })
    const eventPromises = docs.map((doc) => {
      const id = doc.path.split('/')[2]
      cache.set(getPath(id), parseDoc(doc))
      return getEvent(id)
    })
    return (await Promise.all(eventPromises))
      .filter((item) => item)
      .sort(sortDesc('dateObj'))
  })
}

export async function getPastEvents () {
  return (await getEvents())
    .filter(({ dateObj }) => !isToday(dateObj) && isPast(dateObj))
}

function getPath (id) {
  return `${id}/${fileName}`
}

export async function getUpcomingEvents () {
  return (await getEvents())
    .filter(({ dateObj }) => isToday(dateObj) || isFuture(dateObj))
    .reverse()
}

export async function setEvent (id, values) {
  const { set } = await getWorkspace()
  await set(getPath(id), values)
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
