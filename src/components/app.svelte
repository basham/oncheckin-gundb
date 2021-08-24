<script>
  import { onMount } from 'svelte'

  const pageMap = {
    'edit-org': 'page-org-edit',
    event: 'page-event-view',
    'new-event': 'page-event-new',
    'new-participant': 'page-participant-new',
    participant: 'page-participant-view'
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
