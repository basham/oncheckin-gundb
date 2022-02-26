<script>
  import { getContext, onMount } from 'svelte'
  import { workspaceStore } from '@src/stores.js'
  import Layout from '@src/layouts/public.svelte'

  const params = getContext('params')

  onMount(async () => {
    workspaceStore.open(params.id)
    const { replica } = await workspaceStore.get()
    const lastSync = await replica.getConfig('last-sync')
    if (!lastSync) {
      // await workspaceStore.syncOnce()
    }
    window.location = '?p=events'
  })
</script>

<Layout title="Opening workspace…">
  <p class="u-m-top-4">Please wait while the workspace syncs and opens. The first time may take awhile.</p>
</Layout>
