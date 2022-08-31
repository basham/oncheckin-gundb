import { getDevice } from '../device.js'

export async function get () {
  const json = await getDevice()
  return { json }
}
