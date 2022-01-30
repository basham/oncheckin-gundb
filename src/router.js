import { ROUTES } from './constants.js'

const params = (new URL(document.location)).searchParams
const dynamicSlugTest = /^\[\w+\]$/
const SLUG_MATCH = 1
const SLUG_INDEX = 2
const SLUG_DYNAMIC = 3
const SLUG_NOT_FOUND = -1

export function getRoute () {
  const path = params.get('p')
  for (const route of ROUTES) {
    const result = testRoute(route, path)
    if (result) {
      return result
    }
  }
  return { route: 404 }
}

function testRoute (route, path) {
  const r = route.split('/')
  const p = path.split('/')
  const candidate = r
    .map((a, i) => {
      const b = p[i]
      if (dynamicSlugTest.test(b)) {
        return [SLUG_NOT_FOUND]
      }
      if (a === b) {
        return [SLUG_MATCH]
      }
      if (a === 'index' && !b) {
        return [SLUG_INDEX]
      }
      if (dynamicSlugTest.test(a) && b) {
        const name = a.slice(1, -1)
        return [SLUG_DYNAMIC, name, b]
      }
      return [SLUG_NOT_FOUND]
    })
  if (candidate.some(([status]) => status === SLUG_NOT_FOUND)) {
    return undefined
  }
  const paramsEntries = candidate
    .filter(([status]) => status === SLUG_DYNAMIC)
    .map(([status, key, value]) => [key, value])
  return {
    component: route.replaceAll('/', '.'),
    params: Object.fromEntries(paramsEntries),
    path,
    route
  }
}
