import { isBefore, isEqual } from 'date-fns'
import { getEvent } from './event.js'
import { getParticipant } from './participant.js'
import { getWorkspace } from './workspace.js'
import { getOrCreate, resolvePath, sortAsc, sortDesc } from '../util.js'

const fileName = 'check-in.json'
const cache = new Map()

function isSpecial (value) {
  return value > 0 && (value % 5 === 0 || /69$/.test(value))
}

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
  const url = `./?p=events/${eventId}/check-ins/${participantId}/edit`
  return {
    ...data,
    host,
    url
  }
}

async function getCheckInIds () {
  return getOrCreate(cache, 'ids', async () => {
    const { storage } = await getWorkspace()
    const checkInsByEventId = new Map()
    const checkInsByParticipantId = new Map()
    storage
      .paths({
        pathStartsWith: resolvePath(),
        pathEndsWith: fileName
      })
      .forEach((path) => {
        const [eventId, participantId] = path.split('/')[2].split('-')
        if (!checkInsByEventId.has(eventId)) {
          checkInsByEventId.set(eventId, new Set())
        }
        checkInsByEventId.get(eventId).add(participantId)
        if (!checkInsByParticipantId.has(participantId)) {
          checkInsByParticipantId.set(participantId, new Set())
        }
        checkInsByParticipantId.get(participantId).add(eventId)
      })
    return { checkInsByEventId, checkInsByParticipantId }
  })
}

export async function getEventCheckIns (eventId) {
  const participantIds = (await getCheckInIds())
    .checkInsByEventId
    .get(eventId) || []
  const checkInPromises = [...participantIds]
    .map(async (participantId) => {
      const participant = await getParticipant(participantId)
      const checkIn = await getCheckIn(eventId, participantId)
      return [checkIn, participant]
    })
  return (await Promise.all(checkInPromises))
    .filter((source) => source.every((i) => i))
    .map(([checkIn, participant]) => ({ ...checkIn, participant }))
    .sort(sortAsc(({ participant }) => participant.displayName))
}

export async function getEventCheckInsWithStats (eventId) {
  const participantIds = (await getCheckInIds())
    .checkInsByEventId
    .get(eventId) || []
  const event = await getEvent(eventId)
  const checkInPromises = [...participantIds]
    .map(async (participantId) => {
      const participant = await getParticipant(participantId)
      const checkIn = await getCheckIn(eventId, participantId)
      const stats = await getParticipantStats(participantId, event.dateObj)
      return [checkIn, participant, stats]
    })
  return (await Promise.all(checkInPromises))
    .filter((source) => source.every((i) => i))
    .map(([checkIn, participant, stats]) => ({ ...checkIn, ...stats, participant }))
    .sort(sortAsc(({ participant }) => participant.displayName))
}

export async function getParticipantCheckIns (participantId) {
  const eventIds = (await getCheckInIds())
    .checkInsByParticipantId
    .get(participantId) || []
  const checkInPromises = [...eventIds]
    .map(async (eventId) => {
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
  const specialCheckInCount = isSpecial(checkInCount)
  const specialHostCount = isSpecial(hostCount)
  const readyForNaming = checkInCount >= 7 && !participant.alias
  return {
    checkInCount,
    hostCount,
    lastEvent,
    missingCheckInCount,
    missingHostCount,
    recordedLastCheckInDateDisplay,
    specialCheckInCount,
    specialHostCount,
    readyForNaming
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
  getEventCheckInsWithStats,
  getParticipantCheckIns,
  getParticipantStats,
  set: setCheckIn
}

export default checkInStore
