import { getDevice } from '@src/server/device.js'

export async function get () {
  const json = await getDevice()
  return { json }
}
