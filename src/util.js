import cuid from 'cuid'
import { APP } from './constants.js'

export function createId () {
  return cuid()
}

export function delay (ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

export function focus (id) {
  waitForElement(id, (el) => el.focus())
}

export function getOrCreate (cache, key, createCallback) {
  if (!cache.has(key)) {
    cache.set(key, createCallback())
  }
  return cache.get(key)
}

export function parseExtension (path, defaultExtension = 'txt') {
  const extGroup = path.match(/\.(.+)$/)
  return extGroup ? extGroup[1] : defaultExtension
}

export function pluralize (count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural
}

// Safe character set inspired by:
// https://github.com/CyberAP/nanoid-dictionary
const numbersSafe = '256789'
const lowercaseSafe = 'bcdfghjkmnpqrstwyz'
const numbersLowercaseSafe = `${numbersSafe}${lowercaseSafe}`

export function randomLetter () {
  return randomString(1, lowercaseSafe)
}

export function randomString (length, dictionary = numbersLowercaseSafe) {
  return Array.from({ length }, () =>
    dictionary[Math.floor(Math.random() * dictionary.length)]
  ).join('')
}

export function randomWord (length = 1) {
  return `${randomLetter()}${randomString(length - 1)}`
}

export function resolvePath (path = '') {
  const prefix = `/${APP}/`
  return path.startsWith(prefix) ? path : `${prefix}${path}`
}

export function sort (selectorOrKey, multiplier) {
  const type = typeof selectorOrKey
  const typeMap = {
    function: selectorOrKey,
    string: (item) => item[selectorOrKey]
  }
  const selector = typeMap[type]
  return (a, b) => {
    const [keyA, keyB] = [a, b]
      .map((item) => selector(item))
    return keyA < keyB ? -1 * multiplier : keyA > keyB ? 1 * multiplier : 0
  }
}

export function sortAsc (key) {
  return sort(key, 1)
}

export function sortDesc (key) {
  return sort(key, -1)
}

export function waitForElement (id, callback = () => {}, retry = 180) {
  const el = document.getElementById(id)
  if (el) {
    return callback(el)
  }
  if (retry > 0) {
    window.requestAnimationFrame(() => waitForElement(id, callback, retry - 1))
  }
}
