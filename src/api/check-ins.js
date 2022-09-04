import { getOrCreate, sortAsc, sortDesc } from '@src/util.js'
import { getCheckIn } from './check-in.js'
import { getEvent } from './event.js'
import { getOrgCheckIns } from './org.js'
import { getParticipant } from './participant.js'
import { cache } from './store.js'

async function getCheckInIds (orgId) {
  return getOrCreate(cache, `checkIns:${orgId}`, async () => {
    const checkIns = await getOrgCheckIns(orgId)
    const checkInsByEventId = new Map()
    const checkInsByParticipantId = new Map()
    checkIns.forEach((key) => {
      const [eventId, participantId] = key.split('-')
      getOrCreate(checkInsByEventId, eventId, () => new Set())
        .add(participantId)
      getOrCreate(checkInsByParticipantId, participantId, () => new Set())
        .add(eventId)
    })
    return { checkInsByEventId, checkInsByParticipantId }
  })
}

export async function getEventCheckIns (orgId, eventId) {
  const participantIds = (await getCheckInIds(orgId))
    .checkInsByEventId
    .get(eventId) || []
  const checkInPromises = [...participantIds]
    .map(async (participantId) => {
      const participant = await getParticipant(orgId, participantId)
      const checkIn = await getCheckIn(orgId, eventId, participantId)
      return [checkIn, participant]
    })
  return (await Promise.all(checkInPromises))
    .filter((source) => source.every((i) => i))
    .map(([checkIn, participant]) => ({ ...checkIn, participant }))
    .sort(sortAsc(({ participant }) => participant.displayName))
}

export async function getParticipantCheckIns (orgId, participantId) {
  return getOrCreate(cache, `checkIns:${orgId}/${participantId}`, async () => {
    const eventIds = (await getCheckInIds(orgId))
      .checkInsByParticipantId
      .get(participantId) || []
    const checkInPromises = [...eventIds]
      .map(async (eventId) => {
        const event = await getEvent(orgId, eventId)
        const checkIn = await getCheckIn(orgId, eventId, participantId)
        return [checkIn, event]
      })
    return (await Promise.all(checkInPromises))
      .filter((source) => source.every((i) => i))
      .map(([checkIn, event]) => ({ ...checkIn, event }))
      .sort(sortDesc(({ event }) => event.dateObj))
  })
}
