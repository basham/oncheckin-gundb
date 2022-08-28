import { getAccount, getAccountWithOrgs, renameAccount } from './account.js'
import { addAccount, addOrg, getCurrentAccountId, getDevice, renameDevice, setCurrentAccount } from './device.js'
import { createEvent, getEvent, getEvents, getEventsByYear, getEventYears, getPastEvents, getUpcomingEvents } from './event.js'
import { createOrg, getOrg, importOrg, renameOrg } from './org.js'
import { createId, createPath, registerRoute, respondWithJSON, respondWithTemplate, todayDate } from './util.js'

const apiPath = createPath.bind(null, 'api')

registerRoute(apiPath('device.json'), async () => {
  const data = await getDevice()
  return respondWithJSON(data)
})

registerRoute(apiPath('account.json'), async () => {
  const id = await getCurrentAccountId()
  const data = await getAccount(id)
  return respondWithJSON(data)
})

registerRoute(apiPath('accounts', '[accountId].json'), async ({ keys }) => {
  const { accountId } = keys
  const data = await getAccount(accountId)
  return respondWithJSON(data)
})

registerRoute(apiPath('id.json'), async () => {
  const data = { id: createId() }
  return respondWithJSON(data)
})

registerRoute(apiPath('orgs', '[orgId].json'), async ({ keys }) => {
  const { orgId } = keys
  const data = await getOrg(orgId)
  return respondWithJSON(data)
})

registerRoute(apiPath('orgs', '[orgId]', 'events.json'), async ({ keys }) => {
  const { orgId } = keys
  const data = await getEvents(orgId)
  return respondWithJSON(data)
})

registerRoute(apiPath('orgs', '[orgId]', 'events', 'upcoming.json'), async ({ keys }) => {
  const { orgId } = keys
  const data = await getUpcomingEvents(orgId)
  return respondWithJSON(data)
})

registerRoute(apiPath('orgs', '[orgId]', 'events', '[eventId].json'), async ({ keys }) => {
  const { orgId, eventId } = keys
  const data = await getEvent(orgId, eventId)
  return respondWithJSON(data)
})

const orgsPath = createPath.bind(null, 'orgs')
const getStartedPath = createPath('get-started')

registerRoute(getStartedPath, async ({ route }) => {
  const device = await getDevice()
  if (device.state === 'active') {
    return Response.redirect(orgsPath())
  }
  const heading = 'Get started'
  return respondWithTemplate({ route, heading })
})

registerRoute(getStartedPath, async ({ request }) => {
  const data = await request.formData()
  const deviceName = data.get('deviceName')
  await renameDevice(deviceName)
  const { id } = await getAccount()
  const accountName = data.get('accountName')
  await renameAccount(id, accountName)
  await addAccount(id)
  await setCurrentAccount(id)
  return Response.redirect(orgsPath())
}, 'POST')

registerRoute(orgsPath(), async ({ route }) => {
  const h1 = 'Organizations'
  const device = await getDevice()
  const id = await getCurrentAccountId()
  const account = await getAccountWithOrgs(id)
  return respondWithTemplate({ route, h1, device, account })
})

const newOrgPath = orgsPath('new')

registerRoute(newOrgPath, ({ route }) => {
  const h1 = 'New organization'
  return respondWithTemplate({ route, h1 })
})

registerRoute(newOrgPath, async ({ request }) => {
  const data = await request.formData()
  const name = data.get('name')
  const { id, url } = await createOrg({ name })
  await addOrg(id)
  return Response.redirect(url)
}, 'POST')

const importOrgPath = orgsPath('import')

registerRoute(importOrgPath, ({ route }) => {
  const h1 = 'Import organization'
  return respondWithTemplate({ route, h1 })
})

registerRoute(importOrgPath, async ({ request }) => {
  const data = await request.json()
  const { url } = await importOrg(data)
  return Response.redirect(url)
}, 'POST')

const orgPath = createPath.bind(null, 'orgs', '[orgId]')

registerRoute(orgPath(), async ({ keys, route }) => {
  route = `${route}.events`
  const h1 = 'Events'
  const { orgId } = keys
  const org = await getOrg(orgId)
  const upcomingEvents = await getUpcomingEvents(orgId)
  const recentEvents = (await getPastEvents(orgId)).slice(0, 5)
  const years = await getEventYears(orgId)
  return respondWithTemplate({ route, h1, org, upcomingEvents, recentEvents, years })
})

const eventsPath = orgPath.bind(null, 'events')
const newEventPath = eventsPath('new')

registerRoute(newEventPath, async ({ keys, route }) => {
  const h1 = 'New event'
  const { orgId } = keys
  const org = await getOrg(orgId)
  const date = todayDate()
  return respondWithTemplate({ route, h1, org, date })
})

registerRoute(newEventPath, async ({ keys, request }) => {
  const { orgId } = keys
  const data = await request.formData()
  const name = data.get('name')
  const date = data.get('date')
  const count = data.get('count')
  const { url } = await createEvent(orgId, { name, date, count})
  return Response.redirect(url)
}, 'POST')

registerRoute(orgPath('events', 'year', '[year]'), async ({ keys, route }) => {
  const { orgId, year } = keys
  const h1 = `Events in ${year}`
  const org = await getOrg(orgId)
  const events = await getEventsByYear(orgId, year)
  return respondWithTemplate({ route, h1, org, events })
})

const eventPath = eventsPath.bind(null, '[eventId]')

registerRoute(eventPath(), async ({ keys, route }) => {
  route = `${route}.check-ins`
  const { orgId, eventId } = keys
  const org = await getOrg(orgId)
  const event = await getEvent(orgId, eventId)
  const h1 = event.name
  const hares = []
  const runners = []
  return respondWithTemplate({ route, h1, org, event, hares, runners })
})

registerRoute(eventPath('edit'), async ({ keys, route }) => {
  const { orgId, eventId } = keys
  const org = await getOrg(orgId)
  const event = await getEvent(orgId, eventId)
  const h1 = event.name
  const h2 = 'Edit event'
  return respondWithTemplate({ route, h1, h2, org, event })
})

const settingsOrgPath = orgPath('settings')

registerRoute(settingsOrgPath, async ({ keys, route }) => {
  const h1 = 'Settings'
  const { orgId } = keys
  const org = await getOrg(orgId)
  return respondWithTemplate({ route, h1, org, orgId })
})

const renameOrgPath = orgPath('rename')

registerRoute(renameOrgPath, async ({ keys, route }) => {
  const h1 = 'Rename organization'
  const { orgId } = keys
  const org = await getOrg(orgId)
  return respondWithTemplate({ route, h1, org, orgId })
})

registerRoute(renameOrgPath, async ({ keys, request }) => {
  const { orgId } = keys
  const data = await request.formData()
  const name = data.get('name')
  await renameOrg(orgId, name)
  const org = await getOrg(orgId)
  return Response.redirect(`${org.url}settings`)
}, 'POST')

registerRoute(orgPath('share'), async ({ keys, route }) => {
  const h1 = 'Share organization'
  const { orgId } = keys
  const org = await getOrg(orgId)
  return respondWithTemplate({ route, h1, org })
})
