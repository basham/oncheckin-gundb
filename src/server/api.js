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

registerRoute('/api/docs/[docId].json', async ({ keys }) => {
  const { docId } = keys
  const data = await getDoc(docId)
  return respondWithJSON(data)
})

registerRoute('/get-started/', async () => {
  const device = await getDevice()
  if (device.state === 'active') {
    return Response.redirect('/account')
  }
  const heading = 'Get started'
  const title = createTitle(heading)
  const route = 'get-started'
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
  return Response.redirect('/account')
}, 'POST')

registerRoute('/account/', async () => {
  const heading = 'Account'
  const title = createTitle(heading)
  const route = 'account'
  const device = await getDevice()
  const id = await getCurrentAccountId()
  const account = await getAccountWithDocs(id)
  const data = { route, heading, device, account }
  return respondWithTemplate({ title, data })
})

registerRoute('/docs/new/', () => {
  const heading = 'New database'
  const title = createTitle(heading)
  const route = 'docs.new'
  const data = { route, heading }
  return respondWithTemplate({ title, data })
})

registerRoute('/docs/new/', async ({ request }) => {
  const data = await request.formData()
  const name = data.get('name')
  const { id } = await createDoc({ name })
  await addDoc(id)
  return Response.redirect(`/docs/${id}`)
}, 'POST')

registerRoute('/docs/import/', () => {
  const heading = 'Import database'
  const title = createTitle(heading)
  const route = 'docs.import'
  const data = { route, heading }
  return respondWithTemplate({ title, data })
})

registerRoute('/docs/import/', async ({ request }) => {
  const data = await request.json()
  const { id } = await importDoc(data)
  return Response.redirect(`/docs/${id}`)
}, 'POST')

registerRoute('/docs/[docId]/', async ({ keys }) => {
  const { docId } = keys
  const route = 'docs.[docId].events.index'
  const heading = 'Events'
  const title = createTitle(heading)
  const doc = await getDoc(docId)
  const upcomingEvents = []
  const recentEvents = []
  const years = []
  const data = { route, heading, doc, docId, upcomingEvents, recentEvents, years }
  return respondWithTemplate({ title, data })
})
