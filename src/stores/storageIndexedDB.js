import { StorageMemory } from 'earthstar/dist/earthstar.min.js'
import { clear, createStore, del, delMany, entries, get, keys, set, setMany } from 'idb-keyval'

export class StorageIndexedDB extends StorageMemory {
  constructor (validators, workspace) {
    super(validators, workspace)

    this._config = createStore(`config/${workspace}`, 'earthstar')
    this._store = createStore(`documents/${workspace}`, 'earthstar')
    this._ready = new Promise((resolve, reject) => {
      entries(this._store).then((docs) => {
        this._docs = Object.fromEntries(docs)
        resolve(true)
      })
    })

    this.onWrite.subscribe(async (e) => {
      const { path } = e.document
      await set(path, this._docs[path], this._store)
      const lastUpdatedKey = e.isLocal ? 'last-local-update' : 'last-remote-update'
      await set(lastUpdatedKey, Date.now(), this._config)
    })
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

  async forgetDocuments (q) {
    super.forgetDocuments(q)
    await this._syncDocuments()
  }

  async discardExpiredDocuments () {
    super.discardExpiredDocuments()
    await this._syncDocuments()
  }

  async _syncDocuments () {
    const pathsToDelete = (await keys())
      .filter((path) => !this._docs[path])
    await delMany(pathsToDelete, this._store)
    await setMany(Object.entries(this._docs), this._store)
  }

  async closeAndForgetWorkspace () {
    this._assertNotClosed()
    this.close()
    this._docs = {}
    this.deleteAllConfig()
    await clear(this._store)
  }
}
