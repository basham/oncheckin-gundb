import { getAccount, getAccountWithDocs, renameAccount } from './account.js'
import { addAccount, addDoc, getCurrentAccountId, getDevice, renameDevice, setCurrentAccount } from './device.js'
import { createDoc, getDoc, importDoc } from './doc.js'
import { createId, createTitle, registerRoute, respondWithJSON, respondWithTemplate } from './util.js'

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
  const title = createTitle(heading)
  const data = { route, heading }
  return respondWithTemplate({ title, data })
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
  const title = createTitle(heading)
  const device = await getDevice()
  const id = await getCurrentAccountId()
  const account = await getAccountWithDocs(id)
  const data = { route, heading, device, account }
  return respondWithTemplate({ title, data })
})

registerRoute('/orgs/new/', ({ route }) => {
  const heading = 'New organization'
  const title = createTitle(heading)
  const data = { route, heading }
  return respondWithTemplate({ title, data })
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
  const title = createTitle(heading)
  const data = { route, heading }
  return respondWithTemplate({ title, data })
})

registerRoute('/orgs/import/', async ({ request }) => {
  const data = await request.json()
  const { id } = await importDoc(data)
  return Response.redirect(`/orgs/${id}`)
}, 'POST')

registerRoute('/orgs/[orgId]/', async ({ keys, route }) => {
  const { orgId } = keys
  route = `${route}.events.index`
  const heading = 'Events'
  const title = createTitle(heading)
  const org = await getDoc(orgId)
  const upcomingEvents = []
  const recentEvents = []
  const years = []
  const data = { route, heading, org, orgId, upcomingEvents, recentEvents, years }
  return respondWithTemplate({ title, data })
})
