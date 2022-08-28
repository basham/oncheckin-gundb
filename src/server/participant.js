import { getOrg, getOrgDB } from './org.js'
import { createYMap } from './store.js'
import { createId } from './util.js'
import { getOrCreate, sortAsc } from '@src/util.js'

const cache = new Map()

export async function createParticipant (orgId, values) {
  return await setParticipant(orgId, createId(), values)
}

export async function getParticipant (orgId, participantId) {
  return getOrCreate(cache, `${orgId}/${participantId}`, async () => {
    const { participants } = await getOrgDB(orgId)
    if (!participants.has(participantId)) {
      return undefined
    }
    const org = await getOrg(orgId)
    const data = participants.get(participantId)
    const alias = data.get('alias') || ''
    const displayName = data.get('alias') || `Just ${data.get('fullName')}`
    const fullName = data.get('fullName') || '(Participant)'
    // const recordedLastCheckInDateObj = data.get('recordedLastCheckInDate') ? parseISO(data.get('recordedLastCheckInDate')) : null
    // const recordedLastCheckInDateDisplay = recordedLastCheckInDateObj ? format(recordedLastCheckInDateObj, 'PP') : ''
    const url = `${org.url}participants/${participantId}/`
    return {
      id: participantId,
      alias,
      displayName,
      fullName,
      // recordedLastCheckInDateDisplay,
      // recordedLastCheckInDateObj,
      url
    }
  })
}

export async function getParticipants (orgId) {
  return getOrCreate(cache, `${orgId}/all`, async () => {
    const db = await getOrgDB(orgId)
    const all = []
    for (const participantId of [...db.participants.keys()]) {
      const participant = await getParticipant(orgId, participantId)
      all.push(participant)
    }
    return all.sort(sortAsc('displayName'))
  })
}

export async function setParticipant (orgId, participantId, values) {
  cache.delete(`${orgId}/all`)
  cache.delete(`${orgId}/${participantId}`)
  const { participants } = await getOrgDB(orgId)
  const participant = getOrCreate(participants, participantId, createYMap)
  participant.doc.transact(() => {
    for (const [key, value] of Object.entries(values)) {
      participant.set(key, value)
    }
  })
  return await getParticipant(orgId, participantId)
}

const participant = {
  create: createParticipant,
  get: getParticipant,
  set: setParticipant
}

export default participant
