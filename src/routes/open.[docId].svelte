<script>
  import { getContext, onMount } from 'svelte'
  import { workspaceStore } from '@src/stores.js'
  import Layout from '@src/layouts/public.svelte'

  const params = getContext('params')

  onMount(async () => {
    await workspaceStore.open(params.id)
    window.location = '?p=events'
  })
</script>

<Layout title="Opening workspace…">
  <p class="u-m-top-4">Please wait while the workspace syncs and opens. The first time may take awhile.</p>
</Layout>
