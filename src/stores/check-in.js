import { getEvent } from './event.js'
import { getParticipant } from './participant.js'
import { getWorkspace, parseDoc } from './workspace.js'
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
  const { checkIns } = await getWorkspace()
  if (!data) {
    return undefined
  }
  const data = checkIns.get(`${eventId}-${participantId}`)
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

function getPath (eventId, participantId) {
  return `${eventId}-${participantId}/${fileName}`
}

export async function setCheckIn (eventId, participantId, values) {
  const { set } = await getWorkspace()
  return await set(getPath(eventId, participantId), values)
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
