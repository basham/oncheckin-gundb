import { get, setJSON } from './util.js'

export function getOrg () {
  return get('org.json')
}

export async function setOrg (values) {
  return await setJSON('org', values)
}

const org = {
  get: getOrg,
  set: setOrg
}

export default org
