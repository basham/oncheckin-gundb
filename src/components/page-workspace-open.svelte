<script>
  import { onMount } from 'svelte'
  import { workspaceStore } from '../stores.js'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const workspaceId = params.get('id')

  onMount(async () => {
    workspaceStore.open(workspaceId)
    const { storage } = await workspaceStore.get()
    const lastSync = await storage.getConfig('last-sync')
    if (!lastSync) {
      await workspaceStore.syncOnce()
    }
    window.location = '?p=home'
  })
</script>

<Page
  theme="app"
  title="Opening workspace…">
  <p>Please wait while the workspace syncs and opens.<br>The first time may take awhile.</p>
</Page>
