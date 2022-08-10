import { ROUTES } from './constants.js'

const params = (new URL(document.location)).searchParams
const dynamicSlugTest = /^\[\w+\]$/
const MATCH = Symbol()
const INDEX = Symbol()
const DYNAMIC = Symbol()
const NOT_FOUND = Symbol()

export function getRoute () {
  const [route, params] = getRouteParams()
  const context = new Map(Object.entries({ route, params }))
  const file = route.replaceAll('/', '.')
  return { context, route, file }
}

function getRouteParams () {
  const path = params.get('p')
  if (!path) {
    return ['index']
  }
  for (const route of ROUTES) {
    const params = getParams(route, path)
    if (params) {
      return [route, params]
    }
  }
  return ['404']
}

function getParams (route, path) {
  const r = route.split('/')
  const p = path.split('/')
  const candidate = r
    .map((a, i) => {
      const b = p[i]
      if (dynamicSlugTest.test(b)) {
        return [NOT_FOUND]
      }
      if (a === b) {
        return [MATCH]
      }
      if (a === 'index' && !b) {
        return [INDEX]
      }
      if (dynamicSlugTest.test(a) && b) {
        const name = a.slice(1, -1)
        return [DYNAMIC, name, b]
      }
      return [NOT_FOUND]
    })
  if (candidate.some(([status]) => status === NOT_FOUND)) {
    return undefined
  }
  const paramsEntries = candidate
    .filter(([status]) => status === DYNAMIC)
    .map(([status, key, value]) => [key, value])
  const params = Object.fromEntries(paramsEntries)
  return params
}
