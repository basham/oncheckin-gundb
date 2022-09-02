import { sortAsc } from '@src/util.js'
import { getAccount } from './account.js'
import { getOrg } from './org.js'

export async function getOrgs (accountId) {
  const account = await getAccount(accountId)

  if (!account) {
    return
  }

  const orgs = []
  for (const orgId of account.orgs) {
    const org = await getOrg(orgId)
    orgs.push(org)
  }
  orgs.sort(sortAsc('name'))

  return orgs
}
