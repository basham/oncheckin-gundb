import { format, parseISO } from 'date-fns'
import { createId, get, resolvePath, set, sortDesc, storage } from './util.js'

const fileName = 'event.json'

export async function createEvent (values) {
  return setEvent(createId(), values)
}

export function getEvent (id) {
  const data = get(`${id}/${fileName}`)
  if (!data) {
    return undefined
  }
  const dateObj = parseISO(data.date)
  const displayDate = format(dateObj, 'PP')
  return {
    ...data,
    id,
    dateObj,
    displayDate
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

export async function setEvent (id, values) {
  return await set(`${id}/${fileName}`, values)
}

const event = {
  create: createEvent,
  get: getEvent,
  getAll: getEvents,
  set: setEvent
}

export default event
