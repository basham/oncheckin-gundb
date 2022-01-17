import { StorageMemory } from 'earthstar/dist/earthstar.min.js'
import { clear, createStore, delMany, entries, keys, set, setMany } from 'idb-keyval'

export class StorageIndexedDB extends StorageMemory {
  constructor (validators, workspace) {
    super(validators, workspace)

    this._store = createStore(workspace, 'earthstar')
    this._ready = new Promise((resolve, reject) => {
      entries(this._store).then((docs) => {
        this._docs = Object.fromEntries(docs)
        resolve(true)
      })
    })

    this.onWrite.subscribe(async (e) => {
      const { path } = e.document
      await set(path, this._docs[path], this._store)
    })
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
