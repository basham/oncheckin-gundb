import { format, parseISO } from 'date-fns'
import { Y } from './util.js'
import { getWorkspace } from './workspace.js'
import { createId, getOrCreate, sortAsc } from '../util.js'

const cache = new Map()

export async function createParticipant (docId, values) {
  return await setParticipant(docId, createId(), values)
}

export async function getParticipant (docId, participantId) {
  return getOrCreate(cache, `${docId}/${participantId}`, async () => {
    const { participants } = await getWorkspace(docId)
    if (!participants.has(participantId)) {
      return undefined
    }
    const data = participants.get(participantId)
    const alias = data.get('alias') || ''
    const displayName = data.get('alias') || `Just ${data.get('fullName')}`
    const fullName = data.get('fullName') || '(Participant)'
    const recordedLastCheckInDateObj = data.get('recordedLastCheckInDate') ? parseISO(data.get('recordedLastCheckInDate')) : null
    const recordedLastCheckInDateDisplay = recordedLastCheckInDateObj ? format(recordedLastCheckInDateObj, 'PP') : ''
    const url = `?p=${docId}/participants/${participantId}`
    return {
      ...data,
      alias,
      displayName,
      fullName,
      id: participantId,
      recordedLastCheckInDateDisplay,
      recordedLastCheckInDateObj,
      url
    }
  })
}

export async function getParticipants (docId) {
  const { participants } = await getWorkspace(docId)
  const promises = [...participants.keys()]
    .map((participantId) => getParticipant(docId, participantId))
  return (await Promise.all(promises))
    .filter((item) => item)
    .sort(sortAsc('displayName'))
}

export async function setParticipant (docId, participantId, values) {
  const { participants } = await getWorkspace(docId)
  const participant = getOrCreate(participants, participantId, () => new Y.Map())
  participant.doc.transact(() => {
    for (const [key, value] of Object.entries(values)) {
      participant.set(key, value)
    }
  })
  return await getParticipant(docId, participantId)
}

const participant = {
  create: createParticipant,
  get: getParticipant,
  getAll: getParticipants,
  set: setParticipant
}

export default participant
