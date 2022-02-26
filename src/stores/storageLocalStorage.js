/*
import { StorageMemory } from 'earthstar/dist/earthstar.min.js'

const { localStorage } = window

export class StorageLocalStorage extends StorageMemory {
  constructor (validators, workspace) {
    super(validators, workspace)

    this._localStorageKeyConfig = `earthstar:config:${workspace}`
    this._localStorageKeyDocs = `earthstar:documents:${workspace}:`

    const docEntries = this._localDocs()
      .map(([key, path]) => [path, JSON.parse(localStorage.getItem(key))])
    this._docs = Object.fromEntries(docEntries)

    this.onWrite.subscribe((e) => {
      this._saveDocument(e.document.path)
    })
  }

  // Each config key gets its own localStorage key.
  setConfig (key, content) {
    key = `${this._localStorageKeyConfig}:${key}`
    localStorage.setItem(key, content)
  }

  getConfig (key) {
    key = `${this._localStorageKeyConfig}:${key}`
    const result = localStorage.getItem(key)
    return result === null ? undefined : result
  }

  deleteConfig (key) {
    key = `${this._localStorageKeyConfig}:${key}`
    localStorage.removeItem(key)
  }

  deleteAllConfig () {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(this._localStorageKeyConfig + ':')) {
        localStorage.removeItem(key)
      }
    }
  }

  forgetDocuments (q) {
    super.forgetDocuments(q)
    this._syncDocuments()
  }

  discardExpiredDocuments () {
    super.discardExpiredDocuments()
    this._syncDocuments()
  }

  _localDocs () {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith(this._localStorageKeyDocs))
      .map((key) => [key, key.slice(this._localStorageKeyDocs.length)])
  }

  _saveDocument (path) {
    const key = `${this._localStorageKeyDocs}${path}`
    localStorage.setItem(key, JSON.stringify(this._docs[path]))
  }

  _syncDocuments () {
    this._localDocs()
      .filter(([key, path]) => !this._docs[path])
      .forEach(([key]) => {
        localStorage.removeItem(key)
      })
    Object.keys(this._docs)
      .forEach((path) => this._saveDocument(path))
  }

  closeAndForgetWorkspace () {
    this._assertNotClosed()
    this.close()
    this._docs = {}
    this.deleteAllConfig()
    this._localDocs().forEach(([key]) => {
      localStorage.removeItem(key)
    })
  }
}
*/
