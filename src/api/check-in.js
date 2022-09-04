import { getOrCreate } from '@src/util.js'
import { getEvent } from './event.js'
import { getOrCreateCheckIn, hasCheckIn } from './org.js'
import { getParticipant } from './participant.js'
import { cache } from './store.js'

export async function createCheckIn (orgId, eventId, participantId, values) {
  return await setCheckIn(orgId, eventId, participantId, values)
}

export async function getCheckIn (orgId, eventId, participantId) {
  return getOrCreate(cache, `checkIn:${orgId}/${eventId}/${participantId}`, async () => {
    if (!(await hasCheckIn(orgId, eventId, participantId))) {
      return undefined
    }
    const event = await getEvent(orgId, eventId)
    const participant = await getParticipant(orgId, participantId)
    const data = await getOrCreateCheckIn(orgId, eventId, participantId)
    const id = `${eventId}-${participantId}`
    const count = data.get('count') ?? 0
    const host = data.get('host') ?? false
    const hostCount = data.get('hostCount') ?? 0
    const specialCount = isSpecial(count)
    const specialHostCount = isSpecial(hostCount)
    const readyForNaming = count >= 5 && !participant.alias
    const url = `${event.url}check-ins/${participantId}/edit/`
    return {
      id,
      eventId,
      participantId,
      count,
      host,
      hostCount,
      readyForNaming,
      specialCount,
      specialHostCount,
      url
    }
  })
}

export async function setCheckIn (orgId, eventId, participantId, values) {
  cache.delete(`checkIns:${orgId}`)
  cache.delete(`checkIns:${orgId}/${eventId}`)
  cache.delete(`checkIns:${orgId}/${participantId}`)
  cache.delete(`checkIn:${orgId}/${eventId}/${participantId}`)
  const checkIn = await getOrCreateCheckIn(orgId, eventId, participantId)
  checkIn.doc.transact(() => {
    for (const [key, value] of Object.entries(values)) {
      checkIn.set(key, value)
    }
  })
  return await getCheckIn(orgId, eventId, participantId)
}

function isSpecial (value) {
  return value > 0 && (value % 5 === 0 || /69$/.test(value))
}
