<script>
  import { onMount } from 'svelte'

  const pageMap = {
    'edit-org': 'EditOrg',
    event: 'ViewEvent',
    'new-event': 'NewEvent'
  }
  const notFoundPage = 'NotFound'
  const defaultPage = 'Main'
  const params = (new URL(document.location)).searchParams
  const page = params.get('p')
  const component = params.has('p') ? (pageMap[page] || notFoundPage) : defaultPage

  let Page = null

  onMount(async () => {
    Page = (await import(`./${component}.svelte.js`)).default
  })
</script>

<svelte:component this={Page}></svelte:component>
