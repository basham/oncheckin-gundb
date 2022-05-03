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
  const { get } = await getWorkspace()
  const path = getPath(eventId, participantId)
  const data = cache.get(path) || await get(path)
  if (!data) {
    return undefined
  }
  const { count = 0, host = false, hostCount = 0 } = data
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
    const { replica } = await getWorkspace()
    const checkInsByEventId = new Map()
    const checkInsByParticipantId = new Map()
    const docs = await replica.queryDocs({
      historyMode: 'latest',
      filter: {
        pathEndsWith: fileName,
        pathStartsWith: resolvePath()
      }
    })
    docs.forEach((doc) => {
      const [eventId, participantId] = doc.path.split('/')[2].split('-')
      cache.set(getPath(eventId, participantId), parseDoc(doc))
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
