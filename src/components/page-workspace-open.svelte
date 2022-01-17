<script>
  import { onMount } from 'svelte'
  import { workspaceStore } from '../stores.js'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const workspaceId = params.get('id')

  onMount(async () => {
    workspaceStore.open(workspaceId)
    // await workspaceStore.syncOnce()
    window.location = '?p=home'
  })
</script>

<Page
  theme="plain"
  title="Opening workspace…">
</Page>
