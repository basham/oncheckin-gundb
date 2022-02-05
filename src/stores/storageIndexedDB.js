import { StorageMemory } from 'earthstar/dist/earthstar.min.js'
import { clear, createStore, del, delMany, entries, get, set, setMany } from 'idb-keyval'
import { debounce } from '../util.js'

export class StorageIndexedDB extends StorageMemory {
  constructor (validators, workspace) {
    super(validators, workspace)

    this._config = createStore(`config/${workspace}`, 'earthstar')
    this._store = createStore(`documents/${workspace}`, 'earthstar')
    this._ready = new Promise((resolve) => {
      entries(this._store).then((docs) => {
        this._docs = Object.fromEntries(docs)
        resolve(true)
      })
    })
    this._tags = new Set()

    const writeEvents = new Set()
    const debouncedSave = debounce(async () => {
      const events = [...writeEvents.values()]
      writeEvents.clear()
      const updates = events
        .map((event) => event.document.path)
        .map((path) => [path, this._docs[path]])
      await setMany(updates, this._store)
      const now = Date.now()
      if (events.some((e) => e.isLocal)) {
        await set('last-local-update', now, this._config)
      }
      if (events.some((e) => !e.isLocal)) {
        await set('last-remote-update', now, this._config)
      }
      const tags = [...this._tags.values()]
      this._tags.clear()
      tags.forEach((resolve) => resolve(true))
    })

    this.onWrite.subscribe(async (e) => {
      writeEvents.add(e)
      debouncedSave()
    })
  }

  tag () {
    const t = new Promise((resolve, reject) => {
      this._tags.add(resolve)
    })
    return t
  }

  async setConfig (key, value) {
    await set(key, value, this._config)
  }

  async getConfig (key) {
    return await get(key, this._config)
  }

  async deleteConfig (key) {
    await del(key, this._config)
  }

  async deleteAllConfig () {
    await clear(this._config)
  }

  async getContent (path) {
    await this._ready
    return super.getContent(path)
  }

  // Replace this method in StorageMemory,
  // so we can more acurrately track adjustments
  // and efficiently update IDB.
  async _filterDocs (shouldKeep) {
    this._assertNotClosed()
    const updates = new Map()
    const deletes = new Set()
    for (const path in this._docs) {
      const slots = this._docs[path]
      for (const author in slots) {
        const doc = slots[author]
        if (!shouldKeep(doc)) {
          delete slots[author]
          updates.set(path, slots)
        }
      }
      if (Object.keys(slots).length === 0) {
        delete this._docs[path]
        updates.delete(path)
        deletes.add(path)
      }
    }
    if (updates.size) {
      const docs = [...updates.entries()]
      await setMany(docs, this._store)
    }
    if (deletes.size) {
      const paths = [...deletes.values()]
      await delMany(paths, this._store)
    }
  }

  async closeAndForgetWorkspace () {
    this._assertNotClosed()
    this.close()
    this._docs = {}
    this.deleteAllConfig()
    await clear(this._store)
  }
}
