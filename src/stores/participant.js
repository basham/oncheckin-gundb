import { format, parseISO } from 'date-fns'
import { Y } from './util.js'
import { getWorkspace } from './workspace.js'
import { createId, getOrCreate, sortAsc } from '../util.js'

const cache = new Map()

export async function createParticipant (values) {
  return await setParticipant(createId(), values)
}

export async function getParticipant (id) {
  return getOrCreate(cache, id, async () => {
    const { participants } = await getWorkspace()
    if (!participants.has(id)) {
      return undefined
    }
    const data = participants.get(id)
    const alias = data.get('alias') || ''
    const displayName = data.get('alias') || `Just ${data.get('fullName')}`
    const fullName = data.get('fullName') || '(Participant)'
    const recordedLastCheckInDateObj = data.get('recordedLastCheckInDate') ? parseISO(data.get('recordedLastCheckInDate')) : null
    const recordedLastCheckInDateDisplay = recordedLastCheckInDateObj ? format(recordedLastCheckInDateObj, 'PP') : ''
    const url = `?p=participants/${id}`
    return {
      ...data,
      alias,
      displayName,
      fullName,
      id,
      recordedLastCheckInDateDisplay,
      recordedLastCheckInDateObj,
      url
    }
  })
}

export async function getParticipants () {
  const { participants } = await getWorkspace()
  const promises = [...participants.keys()]
    .map(getParticipant)
  return (await Promise.all(promises))
    .filter((item) => item)
    .sort(sortAsc('displayName'))
}

export async function setParticipant (id, values) {
  const { participants } = await getWorkspace()
  const participant = getOrCreate(participants, id, () => new Y.Map())
  participant.doc.transact(() => {
    for (const [key, value] of Object.entries(values)) {
      participant.set(key, value)
    }
  })
  return getParticipant(id)
}

const participant = {
  create: createParticipant,
  get: getParticipant,
  getAll: getParticipants,
  set: setParticipant
}

export default participant
