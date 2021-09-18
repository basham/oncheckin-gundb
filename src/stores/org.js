import { get, set } from './util.js'

const fileName = 'org.json'

export function getOrg () {
  const data = get(fileName)
  if (!data) {
    return undefined
  }
  const name = data.name || '(Organization)'
  return {
    ...data,
    name
  }
}

export async function setOrg (values) {
  return await set(fileName, values)
}

const org = {
  get: getOrg,
  set: setOrg
}

export default org
