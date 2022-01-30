import { format, parseISO } from 'date-fns'
import { getWorkspace } from './workspace.js'
import { createId, resolvePath, sortAsc } from '../util.js'

const fileName = 'participant.json'

export async function createParticipant (values) {
  return await setParticipant(createId(), values)
}

export async function getParticipant (id) {
  const { get } = await getWorkspace()
  const data = await get(`${id}/${fileName}`)
  if (!data) {
    return undefined
  }
  const alias = data.alias || ''
  const displayName = data.alias || `Just ${data.firstName}`
  const fullName = `${data.firstName} ${data.lastName}`.trim() || '(Participant)'
  const recordedLastCheckInDateObj = data.recordedLastCheckInDate ? parseISO(data.recordedLastCheckInDate) : null
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
}

export async function getParticipants () {
  const { storage } = await getWorkspace()
  const ids = storage
    .paths({
      pathStartsWith: resolvePath(),
      pathEndsWith: fileName
    })
    .map((path) => path.split('/')[2])
  const uniqueIds = Array.from(new Set(ids))
  const participantPromises = uniqueIds
    .map(getParticipant)
  return (await Promise.all(participantPromises))
    .filter((item) => item)
    .sort(sortAsc('displayName'))
}

export async function setParticipant (id, values) {
  const { set } = await getWorkspace()
  await set(`${id}/${fileName}`, values)
  return await getParticipant(id)
}

const participant = {
  create: createParticipant,
  get: getParticipant,
  getAll: getParticipants,
  set: setParticipant
}

export default participant
