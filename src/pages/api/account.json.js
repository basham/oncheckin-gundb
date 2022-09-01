import { getAccount } from '@src/server/account.js'
import { getCurrentAccountId } from '@src/server/device.js'

export async function get () {
  const id = await getCurrentAccountId()
  const json = await getAccount(id)
  return { json }
}
