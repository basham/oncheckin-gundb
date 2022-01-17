import { StorageMemory } from 'earthstar/dist/earthstar.min.js'
import { StorageIndexedDB } from './storageIndexedDB.js'

// https://github.com/flexdinesh/browser-or-node
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

export const EarthstarStorage = isBrowser ? StorageIndexedDB : StorageMemory

const storage = new Map()
const memoryStorage = {
  getItem: (key) => storage.get(key) || null,
  setItem: (key, value) => storage.set(key, value)
}

export const localStorage = isBrowser ? window.localStorage : memoryStorage

export const atob = isBrowser ? window.atob : (str) => Buffer.from(str, 'base64').toString('binary')

export const btoa = isBrowser ? window.btoa : (str) => Buffer.from(str, 'binary').toString('base64')
