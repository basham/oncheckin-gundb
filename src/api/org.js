import { getOrCreate } from '@src/util.js'
import { cache, createId, createYMap, createRemoteStore } from './store.js'

export async function createOrg ({ id = createId(), name }) {
  const db = await getOrgDB(id)
  db.settings.set('name', name)
  return await getOrg(id)
}

export async function deleteCheckIn (orgId, eventId, participantId) {
  const { checkIns } = await getOrgDB(orgId)
  checkIns.delete(`${eventId}-${participantId}`)
  cache.delete(`checkIns:${orgId}`)
  cache.delete(`checkIns:${orgId}/${eventId}`)
  cache.delete(`checkIns:${orgId}/${participantId}`)
  cache.delete(`checkIn:${orgId}/${eventId}/${participantId}`)
}

export async function getOrCreateCheckIn (orgId, eventId, participantId) {
  const { checkIns } = await getOrgDB(orgId)
  return getOrCreate(checkIns, `${eventId}-${participantId}`, createYMap)
}

export async function getOrCreateEvent (orgId, eventId) {
  const { events } = await getOrgDB(orgId)
  return getOrCreate(events, eventId, createYMap)
}

export async function getOrCreateParticipant (orgId, participantId) {
  const { participants } = await getOrgDB(orgId)
  return getOrCreate(participants, participantId, createYMap)
}

export async function getOrgDB (id = createId()) {
  return getOrCreate(cache, `org:${id}`, async () => {
    const store = await createRemoteStore(id)
    const data = store.doc.getMap('data')
    const rows = ['settings', 'checkIns', 'events', 'participants']
      .map((key) => [key, getOrCreate(data, key, createYMap)])
    const rowsEntries = Object.fromEntries(rows)
    return { ...store, ...rowsEntries }
  })
}

export async function getOrg (id) {
  const db = await getOrgDB(id)

  if (!db) {
    return
  }

  const name = db.settings.get('name') || '(Organization)'
  const url = `/orgs/${id}/`
  const openUrl = `${url}open/`
  const inviteCode = self.btoa(JSON.stringify({ id, name }))
  const shareUrl = `${self.location.origin}/orgs/join/${inviteCode}`
  return {
    id,
    name,
    openUrl,
    shareUrl,
    url
  }
}

export async function getOrgCheckIns (id) {
  const db = await getOrgDB(id)

  if (!db) {
    return
  }

  return [...db.checkIns.keys()]
}

export async function getOrgEvents (id) {
  const db = await getOrgDB(id)

  if (!db) {
    return
  }

  return [...db.events.keys()]
}

export async function getOrgParticipants (id) {
  const db = await getOrgDB(id)

  if (!db) {
    return
  }

  return [...db.participants.keys()]
}

export async function hasCheckIn (orgId, eventId, participantId) {
  const { checkIns } = await getOrgDB(orgId)
  return checkIns.has(`${eventId}-${participantId}`)
}

export async function hasEvent (orgId, eventId) {
  const { events } = await getOrgDB(orgId)
  return events.has(eventId)
}

export async function hasParticipant (orgId, participantId) {
  const { participants } = await getOrgDB(orgId)
  return participants.has(participantId)
}

export async function importOrg (content) {
  const { name } = content.settings
  const db = await getOrgDB()
  const origin = 'importer'
  const didImport = new Promise((resolve) => {
    db.doc.on('afterTransaction', function (transaction) {
      if (transaction.origin === origin) {
        db.doc.off('afterTransaction', this)
        resolve(transaction)
      }
    })
  })
  db.doc.transact(() => {
    db.settings.set('name', name)
    const items = ['events', 'participants', 'checkIns']
      .map((itemType) => Object.entries(content[itemType]).map((item) => [itemType, ...item]))
      .flat()
    for (const [itemType, id, values] of items) {
      const entity = getOrCreate(db[itemType], id, createYMap)
      for (const [key, value] of Object.entries(values)) {
        entity.set(key, value)
      }
    }
  }, origin)
  await didImport
  await db.save()
  return db
}

export async function renameOrg (id, name) {
  const db = await getOrgDB(id)
  db.settings.set('name', name)
}
