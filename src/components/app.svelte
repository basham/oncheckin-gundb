<script>
  import { onMount } from 'svelte'

  const pageMap = {
    'edit-check-in': 'page-check-in-edit',
    'edit-event': 'page-event-edit',
    'edit-participant': 'page-participant-edit',
    event: 'page-event-view',
    events: 'page-event-index',
    'new-check-in': 'page-check-in-new',
    'new-event': 'page-event-new',
    'new-participant': 'page-participant-new',
    participant: 'page-participant-view',
    participants: 'page-participant-index',
    roster: 'page-event-roster',
    settings: 'page-settings',
    workspace: 'page-workspace'
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
