import { getEvent } from './event.js'
import { getParticipant } from './participant.js'
import { get, resolvePath, set, sortAsc, sortDesc, storage } from './util.js'

const fileName = 'event-participant.txt'

export async function addAttendee (eventId, participantId) {
  return await setAttendee(eventId, participantId, 'attendee')
}

export async function addHost (eventId, participantId) {
  return await setAttendee(eventId, participantId, 'host')
}

export function getAttendees (eventId) {
  return storage
    .paths({
      pathStartsWith: resolvePath(),
      pathEndsWith: fileName
    })
    .filter((path) => path.includes(eventId))
    .map((path) => {
      const participantId = path.split('/')[2].split('-')[1]
      const participant = getParticipant(participantId)
      const attendee = get(path)
      const isHost = attendee === 'host'
      return {
        ...participant,
        attendee,
        isHost
      }
    })
    .filter(({ attendee }) => attendee)
    .sort(sortAsc('fullName'))
}

export function getEvents (participantId) {
  return storage
    .paths({
      pathStartsWith: resolvePath(),
      pathEndsWith: fileName
    })
    .filter((path) => path.includes(participantId))
    .map((path) => {
      const eventId = path.split('/')[2].split('-')[0]
      const event = getEvent(eventId)
      const attendee = get(path)
      const isHost = attendee === 'host'
      return {
        ...event,
        attendee,
        isHost
      }
    })
    .filter(({ attendee }) => attendee)
    .sort(sortDesc('dateObj'))
}

export async function removeAttendee (eventId, participantId) {
  return await setAttendee(eventId, participantId, '')
}

export async function setAttendee (eventId, participantId, value) {
  return await set(`${eventId}-${participantId}/${fileName}`, value)
}

const attendance = {
  addAttendee,
  addHost,
  getAttendees,
  getEvents,
  removeAttendee
}

export default attendance
