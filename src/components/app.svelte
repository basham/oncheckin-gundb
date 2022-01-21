<script>
  import { onMount } from 'svelte'

  const pageMap = {
    'edit-check-in': 'page-check-in-edit',
    'edit-event': 'page-event-edit',
    'edit-participant': 'page-participant-edit',
    'edit-pub': 'page-settings-pub',
    event: 'page-event-view',
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
  const notFoundPage = 'page-not-found'
  const defaultPage = 'page-home'
  const params = (new URL(document.location)).searchParams
  const page = params.get('p')
  const component = params.has('p') ? (pageMap[page] || notFoundPage) : defaultPage

  let Page = null

  onMount(async () => {
    try {
      Page = (await import(`./${component}.svelte.js`)).default
    } catch (e) {
      console.error(e)
    }
  })
</script>

<svelte:component this={Page}></svelte:component>
