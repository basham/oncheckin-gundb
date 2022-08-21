import { getEvent } from './event.js'
import { getParticipant } from './participant.js'
import { Y } from './util.js'
import { getWorkspace } from './workspace.js'
import { getOrCreate, sortAsc, sortDesc } from '../util.js'

const cache = new Map()

function getId (eventId, participantId) {
  return `${eventId}-${participantId}`
}

function isSpecial (value) {
  return value > 0 && (value % 5 === 0 || /69$/.test(value))
}

export async function createCheckIn (docId, eventId, participantId, values) {
  return await setCheckIn(docId, eventId, participantId, values)
}

export async function deleteCheckIn (docId, eventId, participantId) {
  const id = getId(eventId, participantId)
  const { checkIns } = await getWorkspace(docId)
  checkIns.delete(id)
}

export async function getCheckIn (docId, eventId, participantId) {
  const id = getId(eventId, participantId)
  const { checkIns } = await getWorkspace(docId)
  if (!checkIns.has(id)) {
    return undefined
  }
  const data = checkIns.get(id)
  const count = data.get('count') ?? 0
  const host = data.get('host') ?? false
  const hostCount = data.get('hostCount') ?? 0
  const participant = await getParticipant(docId, participantId)
  const specialCount = isSpecial(count)
  const specialHostCount = isSpecial(hostCount)
  const readyForNaming = count >= 5 && !participant.alias
  const url = `./?p=${docId}/events/${eventId}/check-ins/${participantId}/edit`
  return {
    count,
    host,
    hostCount,
    readyForNaming,
    specialCount,
    specialHostCount,
    url
  }
}

async function getCheckInIds (docId) {
  return getOrCreate(cache, `${docId}/ids`, async () => {
    const { checkIns } = await getWorkspace(docId)
    const checkInsByEventId = new Map()
    const checkInsByParticipantId = new Map()
    const keys = [...checkIns.keys()]
    keys.forEach((key) => {
      const [eventId, participantId] = key.split('-')
      getOrCreate(checkInsByEventId, eventId, () => new Set())
        .add(participantId)
      getOrCreate(checkInsByParticipantId, participantId, () => new Set())
        .add(eventId)
    })
    return { checkInsByEventId, checkInsByParticipantId }
  })
}

export async function getEventCheckIns (docId, eventId) {
  const participantIds = (await getCheckInIds(docId))
    .checkInsByEventId
    .get(eventId) || []
  const checkInPromises = [...participantIds]
    .map(async (participantId) => {
      const participant = await getParticipant(docId, participantId)
      const checkIn = await getCheckIn(docId, eventId, participantId)
      return [checkIn, participant]
    })
  return (await Promise.all(checkInPromises))
    .filter((source) => source.every((i) => i))
    .map(([checkIn, participant]) => ({ ...checkIn, participant }))
    .sort(sortAsc(({ participant }) => participant.displayName))
}

export async function getParticipantCheckIns (docId, participantId) {
  return getOrCreate(cache, `participant-${docId}/${participantId}`, async () => {
    const eventIds = (await getCheckInIds(docId))
      .checkInsByParticipantId
      .get(participantId) || []
    const checkInPromises = [...eventIds]
      .map(async (eventId) => {
        const event = await getEvent(docId, eventId)
        const checkIn = await getCheckIn(docId, eventId, participantId)
        return [checkIn, event]
      })
    return (await Promise.all(checkInPromises))
      .filter((source) => source.every((i) => i))
      .map(([checkIn, event]) => ({ ...checkIn, event }))
      .sort(sortDesc(({ event }) => event.dateObj))
  })
}

export async function setCheckIn (docId, eventId, participantId, values) {
  const id = getId(eventId, participantId)
  const { checkIns } = await getWorkspace(docId)
  const checkIn = getOrCreate(checkIns, id, () => new Y.Map())
  checkIn.doc.transact(() => {
    for (const [key, value] of Object.entries(values)) {
      checkIn.set(key, value)
    }
  })
  return await getCheckIn(docId, eventId, participantId)
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
