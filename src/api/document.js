import { IndexeddbPersistence, storeState } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc-packets'
import { Y } from '../stores/util.js'
import { APP } from '../constants.js'
import { getOrCreate } from '../util.js'

const cache = new Map()

export async function getDoc (docId) {
  // To do: If the id does not exist in the account,
  // return undefined.
  return getOrCreate(cache, `workspace/${docId}`, async () => {
    const document = await createDoc(`${APP}-${docId}`, { local: true, remote: true })
    const { data } = document
    const settings = getOrCreate(data, 'settings', () => new Y.Map())
    const checkIns = getOrCreate(data, 'checkIns', () => new Y.Map())
    const events = getOrCreate(data, 'events', () => new Y.Map())
    const participants = getOrCreate(data, 'participants', () => new Y.Map())
    return {
      ...document,
      checkIns,
      events,
      id: docId,
      participants,
      settings
    }
  })
}

export async function getDocument (docId) {
  const doc = await getDoc(docId)

  if (!doc) {
    return
  }

  const name = doc.settings.get('name') || '(Workspace)'
  const openUrl = `?p=open/${docId}`
  const inviteCode = self.btoa(JSON.stringify({ id: docId, name }))
  const shareUrl = `${self.location.origin}/?p=join/${inviteCode}`
  return {
    id: docId,
    name,
    openUrl,
    shareUrl
  }
}

export async function createDoc (id, options = {}) {
  const { local = false, remote = false, remoteOptions } = options
  const doc = new Y.Doc()
  doc.on('update', (u, origin) => {
    console.log('U', u, origin)
  })
  const data = doc.getMap('data')
  const localProvider = local ? new IndexeddbPersistence(id, doc) : undefined
  const save = () => localProvider ? storeState(localProvider) : Promise.resolve()
  if (localProvider) {
    await localProvider.whenSynced
  }
  const remoteProvider = remote ? new WebrtcProvider(id, doc, remoteOptions) : undefined
  if (remoteProvider) {
    const { awareness } = remoteProvider
    awareness.on('change', (changes) => {
      console.log(Array.from(awareness.getStates().values()))
    })
    awareness.setLocalStateField('user', {
      random: Math.random()
    })
    console.log('SYNCING to room', id)
  }
  return { data, doc, id, localProvider, remoteProvider, save }
}
