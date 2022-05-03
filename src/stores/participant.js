import { format, parseISO } from 'date-fns'
import { getWorkspace, parseDoc } from './workspace.js'
import { createId, getOrCreate, resolvePath, sortAsc } from '../util.js'

const fileName = 'participant.json'
const cache = new Map()

export async function createParticipant (values) {
  return await setParticipant(createId(), values)
}

export async function getParticipant (id) {
  return getOrCreate(cache, id, async () => {
    const { get } = await getWorkspace()
    const path = getPath(id)
    const data = cache.get(path) || await get(path)
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
  })
}

export async function getParticipants () {
  const { replica } = await getWorkspace()
  const docs = await replica.queryDocs({
    historyMode: 'latest',
    filter: {
      pathEndsWith: fileName,
      pathStartsWith: resolvePath()
    }
  })
  const participantPromises = docs.map((doc) => {
    const id = doc.path.split('/')[2]
    cache.set(getPath(id), parseDoc(doc))
    return getParticipant(id)
  })
  return (await Promise.all(participantPromises))
    .filter((item) => item)
    .sort(sortAsc('displayName'))
}

export async function setParticipant (id, values) {
  const { set } = await getWorkspace()
  await set(getPath(id), values)
  return await getParticipant(id)
}

function getPath (id) {
  return `${id}/${fileName}`
}

const participant = {
  create: createParticipant,
  get: getParticipant,
  getAll: getParticipants,
  set: setParticipant
}

export default participant
