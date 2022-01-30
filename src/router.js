import { ROUTES } from './constants.js'

const params = (new URL(document.location)).searchParams
const dynamicSlugTest = /^\[\w+\]$/
const MATCH = 1
const INDEX = 2
const DYNAMIC = 3
const NOT_FOUND = -1

export function getRoute () {
  const path = params.get('p')
  if (!path) {
    return { component: 'index' }
  }
  for (const route of ROUTES) {
    const result = testRoute(route, path)
    if (result) {
      return result
    }
  }
  return { component: 404 }
}

function testRoute (route, path) {
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
  return {
    component: route.replaceAll('/', '.'),
    params: Object.fromEntries(paramsEntries),
    path,
    route
  }
}
