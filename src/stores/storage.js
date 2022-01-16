import {
  StorageLocalStorage,
  StorageMemory
} from 'earthstar/dist/earthstar.min.js'

// https://github.com/flexdinesh/browser-or-node
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

export const EarthstarStorage = isBrowser ? StorageLocalStorage : StorageMemory

const storage = new Map()
const memoryStorage = {
  getItem: (key) => storage.get(key),
  setItem: (key, value) => storage.set(key, value)
}

export const localStorage = isBrowser ? window.localStorage : memoryStorage
