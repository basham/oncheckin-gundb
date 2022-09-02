import { getAccount, getCurrentAccountId, getDevice, getOrgs } from '@src/api.js'

export async function get () {
  const h1 = 'Organizations'
  const device = await getDevice()
  const id = await getCurrentAccountId()
  const account = await getAccount(id)
  const orgs = await getOrgs(id)
  const template = { h1, device, account, orgs }
  return { template }
}
