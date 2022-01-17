import { isBefore, isEqual } from 'date-fns'
import { getEvent } from './event.js'
import { getParticipant } from './participant.js'
import { getWorkspace } from './workspace.js'
import { resolvePath, sortAsc, sortDesc } from '../util.js'

const fileName = 'check-in.json'

export async function createCheckIn (eventId, participantId, values) {
  return await setCheckIn(eventId, participantId, values)
}

export async function deleteCheckIn (eventId, participantId) {
  return await setCheckIn(eventId, participantId, '')
}

export async function getCheckIn (eventId, participantId) {
  const { get } = await getWorkspace()
  const data = await get(`${eventId}-${participantId}/${fileName}`)
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

export async function getCheckInIds () {
  const { storage } = await getWorkspace()
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

export async function getEventCheckIns (eventId) {
  const checkInPromises = (await getCheckInIds())
    .filter((ids) => ids.eventId === eventId)
    .map(async ({ participantId }) => {
      const participant = await getParticipant(participantId)
      const checkIn = await getCheckIn(eventId, participantId)
      return [checkIn, participant]
    })
  return (await Promise.all(checkInPromises))
    .filter((source) => source.every((i) => i))
    .map(([checkIn, participant]) => ({ ...checkIn, participant }))
    .sort(sortAsc(({ participant }) => participant.displayName))
}

export async function getParticipantCheckIns (participantId) {
  const checkInPromises = (await getCheckInIds())
    .filter((ids) => ids.participantId === participantId)
    .map(async ({ eventId }) => {
      const event = await getEvent(eventId)
      const checkIn = await getCheckIn(eventId, participantId)
      return [checkIn, event]
    })
  return (await Promise.all(checkInPromises))
    .filter((source) => source.every((i) => i))
    .map(([checkIn, event]) => ({ ...checkIn, event }))
    .sort(sortDesc(({ event }) => event.dateObj))
}

export async function getParticipantStats (participantId, date) {
  const participant = await getParticipant(participantId)
  const { recordedLastCheckInDateDisplay, recordedLastCheckInDateObj, recordedCheckInsCount = 0, recordedHostCount = 0 } = participant
  const checkIns = (await getParticipantCheckIns(participantId))
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
  const { set } = await getWorkspace()
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
