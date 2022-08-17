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

export async function createCheckIn (eventId, participantId, values) {
  return await setCheckIn(eventId, participantId, values)
}

export async function deleteCheckIn (eventId, participantId) {
  const id = getId(eventId, participantId)
  const { checkIns } = await getWorkspace()
  checkIns.delete(id)
}

export async function getCheckIn (eventId, participantId) {
  const id = getId(eventId, participantId)
  const { checkIns } = await getWorkspace()
  if (!checkIns.has(id)) {
    return undefined
  }
  const data = checkIns.get(id)
  const count = data.get('count') ?? 0
  const host = data.get('host') ?? false
  const hostCount = data.get('hostCount') ?? 0
  const participant = await getParticipant(participantId)
  const specialCount = isSpecial(count)
  const specialHostCount = isSpecial(hostCount)
  const readyForNaming = count >= 5 && !participant.alias
  const url = `./?p=events/${eventId}/check-ins/${participantId}/edit`
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

async function getCheckInIds () {
  return getOrCreate(cache, 'ids', async () => {
    const { checkIns } = await getWorkspace()
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

export async function getParticipantCheckIns (participantId) {
  return getOrCreate(cache, `participant-${participantId}`, async () => {
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
  })
}

export async function setCheckIn (eventId, participantId, values) {
  const id = getId(eventId, participantId)
  const { checkIns } = await getWorkspace()
  const checkIn = getOrCreate(checkIns, id, () => new Y.Map())
  checkIn.doc.transact(() => {
    for (const [key, value] of Object.entries(values)) {
      checkIn.set(key, value)
    }
  })
  return getCheckIn(eventId, participantId)
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
