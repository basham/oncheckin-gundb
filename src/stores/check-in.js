import { getEvent } from './event.js'
import { getParticipant } from './participant.js'
import { get, resolvePath, set, sortAsc, sortDesc, storage } from './util.js'

const fileName = 'event-participant.txt'

export async function createCheckIn (eventId, participantId, value) {
  return await setCheckIn(eventId, participantId, value)
}

export async function deleteCheckIn (eventId, participantId) {
  return await setCheckIn(eventId, participantId, '')
}

export function getCheckIn (eventId, participantId) {
  const attendee = get(`${eventId}-${participantId}/${fileName}`)
  const isHost = attendee === 'host'
  const url = `./?p=edit-check-in&event-id=${eventId}&participant-id=${participantId}`
  return {
    attendee,
    isHost,
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
      return {
        ...checkIn,
        participant
      }
    })
    .filter(({ attendee }) => attendee)
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
      return {
        ...checkIn,
        event
      }
    })
    .filter(({ attendee }) => attendee)
    .sort(sortDesc(({ event }) => event.dateObj))
}

export async function setCheckIn (eventId, participantId, value) {
  return await set(`${eventId}-${participantId}/${fileName}`, value)
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
