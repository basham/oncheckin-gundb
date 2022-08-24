import { routes } from './routes.js'

const dynamicSlugTest = /^\[\w+\]$/
const MATCH = Symbol()
const INDEX = Symbol()
const DYNAMIC = Symbol()
const NOT_FOUND = Symbol()

export function router (event) {
  const [route, params, data] = getRouteParams(event)
  // const context = new Map(Object.entries({ route, params }))
  const file = route.replaceAll('/', '.')
  return { route, params, data, file }
}

function getRouteParams (event) {
  const { pathname } = (new URL(event.request.url))
  if (!pathname) {
    return ['index']
  }
  for (const [route, get] of routes) {
    const params = getParams(route, pathname)
    if (params) {
      return [route, params, get]
    }
  }
  return ['404']
}

function getParams (route, pathname) {
  const r = route.split('/')
  const p = pathname.split('/')
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
