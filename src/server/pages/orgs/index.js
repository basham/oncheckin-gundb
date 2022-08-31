import { getAccountWithOrgs } from '@src/server/account.js'
import { getCurrentAccountId, getDevice } from '@src/server/device.js'

export async function get ({ route }) {
  const h1 = 'Organizations'
  const device = await getDevice()
  const id = await getCurrentAccountId()
  const account = await getAccountWithOrgs(id)
  const template = { route, h1, device, account }
  return { template }
}
