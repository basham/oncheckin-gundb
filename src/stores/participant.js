import { createId, get, resolvePath, set, storage } from './util.js'

const fileName = 'participant.json'

export async function createParticipant (values) {
  return setParticipant(createId(), values)
}

export function getParticipant (id) {
  const data = get(`${id}/${fileName}`)
  if (!data) {
    return undefined
  }
  const fullName = `${data.firstName} ${data.lastName}`.trim()
  return {
    ...data,
    id,
    fullName
  }
}

export function getParticipants () {
  const ids = storage
    .paths({
      pathStartsWith: resolvePath(),
      pathEndsWith: fileName
    })
    .map((path) => path.split('/')[2])
  const uniqueIds = Array.from(new Set(ids))
  return uniqueIds
    .map(getParticipant)
    .filter((item) => item)
    .sort((a, b) => {
      const [keyA, keyB] = [a, b]
        .map(({ fullName }) => fullName)
      return keyA < keyB ? -1 : keyA > keyB ? 1 : 0
    })
}

export async function setParticipant (id, values) {
  return await set(`${id}/${fileName}`, values)
}

const participant = {
  create: createParticipant,
  get: getParticipant,
  getAll: getParticipants,
  set: setParticipant
}

export default participant
