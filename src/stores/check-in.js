import { getEvent } from './event.js'
import { getParticipant } from './participant.js'
import { get, resolvePath, set, sortAsc, sortDesc, storage } from './util.js'

const fileName = 'check-in.json'

export async function createCheckIn (eventId, participantId, values) {
  return await setCheckIn(eventId, participantId, values)
}

export async function deleteCheckIn (eventId, participantId) {
  return await setCheckIn(eventId, participantId, '')
}

export function getCheckIn (eventId, participantId) {
  const data = get(`${eventId}-${participantId}/${fileName}`)
  if (!data) {
    return undefined
  }
  const host = data?.host ?? false
  const url = `./?p=edit-check-in&event-id=${eventId}&participant-id=${participantId}`
  return {
    ...data,
    host,
    url
  }
}

export function getEventCheckIns (eventId) {
  return storage
    .paths({
      pathStartsWith: resolvePath(),
      pathEndsWith: fileName
    })
    .filter((path) => path.includes(eventId))
    .map((path) => {
      const participantId = path.split('/')[2].split('-')[1]
      const participant = getParticipant(participantId)
      const checkIn = getCheckIn(eventId, participantId)
      return [checkIn, participant]
    })
    .filter((source) => source.every((i) => i))
    .map(([checkIn, participant]) => ({ ...checkIn, participant }))
    .sort(sortAsc(({ participant }) => participant.displayName))
}

export function getParticipantCheckIns (participantId) {
  return storage
    .paths({
      pathStartsWith: resolvePath(),
      pathEndsWith: fileName
    })
    .filter((path) => path.includes(participantId))
    .map((path) => {
      const eventId = path.split('/')[2].split('-')[0]
      const event = getEvent(eventId)
      const checkIn = getCheckIn(eventId, participantId)
      return [checkIn, event]
    })
    .filter((source) => source.every((i) => i))
    .map(([checkIn, event]) => ({ ...checkIn, event }))
    .sort(sortDesc(({ event }) => event.dateObj))
}

export async function setCheckIn (eventId, participantId, values) {
  return await set(`${eventId}-${participantId}/${fileName}`, values)
}

const checkInStore = {
  create: createCheckIn,
  delete: deleteCheckIn,
  get: getCheckIn,
  getEventCheckIns,
  getParticipantCheckIns,
  set: setCheckIn
}

export default checkInStore
