import { getAccount, getAccountWithOrgs, renameAccount } from './account.js'
import { addAccount, addOrg, getCurrentAccountId, getDevice, renameDevice, setCurrentAccount } from './device.js'
import { createEvent, getEvent, getEvents, getEventsByYear, getEventYears, getPastEvents, getUpcomingEvents, setEvent } from './event.js'
import { createOrg, getOrg, importOrg, renameOrg } from './org.js'
import { createParticipant, getParticipant, getParticipants, setParticipant } from './participant.js'
import { createPath, registerRoute, registerRoute2, respondWithJSON, respondWithTemplate, todayDate } from './util.js'

const modules = import.meta.glob('../pages/**/*.js', { eager: true })

// Reverse the list of modules so dynamic `[key]` folders and files are resolved last.
for (const [url, mod] of Object.entries(modules).reverse()) {
  const path = url
    .replace(/^\.\.\/pages/, '')
    .replace(/\.js$/, '')
  const { get, post } = mod
  if (get) {
    registerRoute2(path, get)
  }
  if (post) {
    registerRoute2(path, post, 'POST')
  }
}

/*
const apiPath = createPath.bind(null, 'api')

registerRoute(apiPath('orgs', '[orgId].json'), async ({ keys }) => {
  const { orgId } = keys
  const data = await getOrg(orgId)
  return respondWithJSON(data)
})

const apiOrgPath = apiPath.bind(null, 'orgs', '[orgId]')

registerRoute(apiOrgPath('events.json'), async ({ keys }) => {
  const { orgId } = keys
  const data = await getEvents(orgId)
  return respondWithJSON(data)
})

registerRoute(apiOrgPath('events', 'upcoming.json'), async ({ keys }) => {
  const { orgId } = keys
  const data = await getUpcomingEvents(orgId)
  return respondWithJSON(data)
})

registerRoute(apiOrgPath('events', '[eventId].json'), async ({ keys }) => {
  const { orgId, eventId } = keys
  const data = await getEvent(orgId, eventId)
  return respondWithJSON(data)
})

registerRoute(apiOrgPath('participants.json'), async ({ keys }) => {
  const { orgId } = keys
  const data = await getParticipants(orgId)
  return respondWithJSON(data)
})

registerRoute(apiOrgPath('participants', '[participantId].json'), async ({ keys }) => {
  const { orgId, participantId } = keys
  const data = await getParticipant(orgId, participantId)
  return respondWithJSON(data)
})

const orgsPath = createPath.bind(null, 'orgs')

const orgPath = createPath.bind(null, 'orgs', '[orgId]')

const participantsPath = orgPath.bind(null, 'participants')

registerRoute(participantsPath(), async ({ keys, route }) => {
  const h1 = 'Hashers'
  const { orgId } = keys
  const org = await getOrg(orgId)
  const participants = await getParticipants(orgId)
  return respondWithTemplate({ route, h1, org, participants })
})

const newParticipantsPath = participantsPath('new')

registerRoute(newParticipantsPath, async ({ keys, route }) => {
  const h1 = 'New hasher'
  const { orgId } = keys
  const org = await getOrg(orgId)
  return respondWithTemplate({ route, h1, org })
})

registerRoute(newParticipantsPath, async ({ keys, request }) => {
  const { orgId } = keys
  const data = await request.formData()
  const fullName = data.get('fullName')
  const alias = data.get('alias')
  const { url } = await createParticipant(orgId, { fullName, alias })
  return Response.redirect(url)
}, 'POST')

const participantPath = participantsPath.bind(null, '[participantId]')

registerRoute(participantPath(), async ({ keys, route }) => {
  route = `${route}/check-ins`
  const { orgId, participantId } = keys
  const org = await getOrg(orgId)
  const participant = await getParticipant(orgId, participantId)
  const h1 = participant.displayName
  const checkIns = []
  const latestCheckIn = null
  return respondWithTemplate({ route, h1, org, participant, checkIns, latestCheckIn })
})

const editParticipantPath = participantPath('edit')

registerRoute(editParticipantPath, async ({ keys, route }) => {
  const { orgId, participantId } = keys
  const org = await getOrg(orgId)
  const participant = await getParticipant(orgId, participantId)
  const h1 = participant.displayName
  const h2 = 'Edit participant'
  return respondWithTemplate({ route, h1, h2, org, participant })
})

registerRoute(editParticipantPath, async ({ keys, request }) => {
  const { orgId, participantId } = keys
  const data = await request.formData()
  const fullName = data.get('fullName')
  const alias = data.get('alias')
  const location = data.get('location')
  const notes = data.get('notes')
  const { url } = await setParticipant(orgId, participantId, { fullName, alias, location, notes })
  return Response.redirect(url)
}, 'POST')
*/
