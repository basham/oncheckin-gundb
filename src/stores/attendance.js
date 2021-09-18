import { getParticipant } from './participant.js'
import { get, resolvePath, set, storage } from './util.js'

const fileName = 'event-participant.txt'

export async function addAttendee (eventId, participantId) {
  return await setAttendee(eventId, participantId, 'attendee')
}

export async function addHost (eventId, participantId) {
  return await setAttendee(eventId, participantId, 'host')
}

export function getAttendees (id) {
  return storage
    .paths({
      pathStartsWith: resolvePath(),
      pathEndsWith: fileName
    })
    .filter((path) => path.includes(id))
    .map((path) => {
      const participantId = path.split('/')[2].split('-')[1]
      const participant = getParticipant(participantId)
      const isHost = get(path) === 'host'
      return {
        ...participant,
        isHost
      }
    })
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
  removeAttendee
}

export default attendance
