import { isBefore, isEqual } from 'date-fns'
import { getEvent } from './event.js'
import { getParticipant } from './participant.js'
import { get, resolvePath, set, storage } from './util.js'
import { sortAsc, sortDesc } from '../util.js'

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

export function getCheckInIds () {
  return storage
    .paths({
      pathStartsWith: resolvePath(),
      pathEndsWith: fileName
    })
    .map((path) => {
      const [eventId, participantId] = path.split('/')[2].split('-')
      return { eventId, participantId }
    })
}

export function getEventCheckIns (eventId) {
  return getCheckInIds()
    .filter((ids) => ids.eventId === eventId)
    .map(({ participantId }) => {
      const participant = getParticipant(participantId)
      const checkIn = getCheckIn(eventId, participantId)
      return [checkIn, participant]
    })
    .filter((source) => source.every((i) => i))
    .map(([checkIn, participant]) => ({ ...checkIn, participant }))
    .sort(sortAsc(({ participant }) => participant.displayName))
}

export function getParticipantCheckIns (participantId) {
  return getCheckInIds()
    .filter((ids) => ids.participantId === participantId)
    .map(({ eventId }) => {
      const event = getEvent(eventId)
      const checkIn = getCheckIn(eventId, participantId)
      return [checkIn, event]
    })
    .filter((source) => source.every((i) => i))
    .map(([checkIn, event]) => ({ ...checkIn, event }))
    .sort(sortDesc(({ event }) => event.dateObj))
}

export function getParticipantStats (participantId, date) {
  const participant = getParticipant(participantId)
  const { recordedLastCheckInDateDisplay, recordedLastCheckInDateObj, recordedCheckInsCount = 0, recordedHostCount = 0 } = participant
  const checkIns = getParticipantCheckIns(participantId)
    .filter(({ event }) => date ? isBefore(event.dateObj, date) : true)
  const foundCheckIns = checkIns
    .filter(({ event }) =>
      recordedLastCheckInDateObj
        ? isBefore(event.dateObj, recordedLastCheckInDateObj) || isEqual(event.dateObj, recordedLastCheckInDateObj)
        : false
    )
  const missingCheckInCount = recordedCheckInsCount - foundCheckIns.length
  const checkInCount = checkIns.length + missingCheckInCount
  const hostCheckIns = checkIns
    .filter(({ host }) => host)
  const foundHostCheckIns = foundCheckIns
    .filter(({ host }) => host)
  const missingHostCount = recordedHostCount - foundHostCheckIns.length
  const hostCount = hostCheckIns.length + missingHostCount
  const lastCheckIn = checkIns[checkIns.length - 1]
  const lastEvent = lastCheckIn?.event
  return {
    checkInCount,
    hostCount,
    lastEvent,
    missingCheckInCount,
    missingHostCount,
    recordedLastCheckInDateDisplay
  }
}

export async function setCheckIn (eventId, participantId, values) {
  return await set(`${eventId}-${participantId}/${fileName}`, values)
}

const checkInStore = {
  create: createCheckIn,
  delete: deleteCheckIn,
  get: getCheckIn,
  getEventCheckIns,
  getIds: getCheckInIds,
  getParticipantCheckIns,
  getParticipantStats,
  set: setCheckIn
}

export default checkInStore
