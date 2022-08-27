import { getAccount, getAccountWithDocs, renameAccount } from './account.js'
import { addAccount, addDoc, getCurrentAccountId, getDevice, renameDevice, setCurrentAccount } from './device.js'
import { createDoc, getDoc, importDoc } from './doc.js'
import { createId, registerRoute, respondWithJSON, respondWithTemplate } from './util.js'

registerRoute('/api/device.json', async () => {
  const data = await getDevice()
  return respondWithJSON(data)
})

registerRoute('/api/account.json', async () => {
  const id = await getCurrentAccountId()
  const data = await getAccount(id)
  return respondWithJSON(data)
})

registerRoute('/api/accounts/[accountId].json', async ({ keys }) => {
  const { accountId } = keys
  const data = await getAccount(accountId)
  return respondWithJSON(data)
})

registerRoute('/api/id.json', async () => {
  const data = { id: createId() }
  return respondWithJSON(data)
})

registerRoute('/api/orgs/[orgId].json', async ({ keys }) => {
  const { orgId } = keys
  const data = await getDoc(orgId)
  return respondWithJSON(data)
})

registerRoute('/get-started/', async ({ route }) => {
  const device = await getDevice()
  if (device.state === 'active') {
    return Response.redirect('/orgs')
  }
  const heading = 'Get started'
  return respondWithTemplate({ route, heading })
})

registerRoute('/get-started/', async ({ request }) => {
  const data = await request.formData()
  const deviceName = data.get('deviceName')
  await renameDevice(deviceName)
  const { id } = await getAccount()
  const accountName = data.get('accountName')
  await renameAccount(id, accountName)
  await addAccount(id)
  await setCurrentAccount(id)
  return Response.redirect('/orgs')
}, 'POST')

registerRoute('/orgs/', async ({ route }) => {
  const heading = 'Organizations'
  const device = await getDevice()
  const id = await getCurrentAccountId()
  const account = await getAccountWithDocs(id)
  return respondWithTemplate({ route, heading, device, account })
})

registerRoute('/orgs/new/', ({ route }) => {
  const heading = 'New organization'
  return respondWithTemplate({ route, heading })
})

registerRoute('/orgs/new/', async ({ request }) => {
  const data = await request.formData()
  const name = data.get('name')
  const { id } = await createDoc({ name })
  await addDoc(id)
  return Response.redirect(`/orgs/${id}`)
}, 'POST')

registerRoute('/orgs/import/', ({ route }) => {
  const heading = 'Import organization'
  return respondWithTemplate({ route, heading })
})

registerRoute('/orgs/import/', async ({ request }) => {
  const data = await request.json()
  const { id } = await importDoc(data)
  return Response.redirect(`/orgs/${id}`)
}, 'POST')

registerRoute('/orgs/[orgId]/', async ({ keys, route }) => {
  route = `${route}.events.index`
  const heading = 'Events'
  const { orgId } = keys
  const org = await getDoc(orgId)
  const upcomingEvents = []
  const recentEvents = []
  const years = []
  return respondWithTemplate({ route, heading, org, orgId, upcomingEvents, recentEvents, years })
})
