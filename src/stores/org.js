import { get, set } from './util.js'

const fileName = 'org.json'

export function getOrg () {
  return get(fileName)
}

export async function setOrg (values) {
  return await set(fileName, values)
}

const org = {
  get: getOrg,
  set: setOrg
}

export default org
