<script>
  import { onMount } from 'svelte'

  const pageMap = {
    'edit-check-in': 'page-check-in-edit',
    'edit-event': 'page-event-edit',
    'edit-participant': 'page-participant-edit',
    'edit-pub': 'page-settings-pub',
    event: 'page-event-view',
    'event-check-ins': 'page-event-view',
    'event-circle': 'page-event-view',
    events: 'page-event-index',
    'events-year': 'page-event-year',
    'get-started': 'page-get-started',
    home: 'page-workspace-home',
    join: 'page-join',
    'new-check-in': 'page-check-in-new',
    'new-event': 'page-event-new',
    'new-participant': 'page-participant-new',
    'new-workspace': 'page-workspace-new',
    'open-workspace': 'page-workspace-open',
    participant: 'page-participant-view',
    participants: 'page-participant-index',
    'rename-workspace': 'page-settings-rename',
    roster: 'page-event-roster',
    settings: 'page-settings',
    share: 'page-share',
    'workspace-created': 'page-workspace-created',
    workspaces: 'page-workspace-index'
  }
  // const notFoundPage = 'page-not-found'
  // const defaultPage = 'page-home'
  const params = (new URL(document.location)).searchParams
  // const page = params.get('p')
  // const component = params.has('p') ? (pageMap[page] || notFoundPage) : defaultPage

  const routes = [
    'events/index',
    'events/new',
    'events/[id]/index',
    'events/[id]/circle',
    'events/[id]/edit',
  ]
  const dynamicSlugTest = /^\[\w+\]$/
  const SLUG_MATCH = 1
  const SLUG_INDEX = 2
  const SLUG_DYNAMIC = 3
  const SLUG_NOT_FOUND = -1

  function getRoute (routes) {
    const path = params.get('p')
    for (let route of routes) {
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

  const route = getRoute(routes)
  let Page = null

  onMount(async () => {
    try {
      Page = (await import(`../routes/${route.component}.svelte.js`)).default
    } catch (e) {
      console.error(e)
    }
  })
</script>

<svelte:component
  this={Page}
  params={route.params}
  route={route.route} />
