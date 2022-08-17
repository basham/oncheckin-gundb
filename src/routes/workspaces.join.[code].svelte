<script>
  import { getContext } from 'svelte'
  import { workspaceStore } from '@src/stores.js'
  import Layout from '@src/layouts/public.svelte'

  const params = getContext('params')
  const { id, name } = JSON.parse(window.atob(params.code))

  async function joinWorkspace () {
    const workspace = await workspaceStore.create({ id, name })
    window.location = workspace.openUrl
  }
</script>

<Layout title="Join workspace">
  <div class="group u-m-top-6">
    <h2 class="u-m-top-0">{name}</h2>
    <p class="u-m-0"><span class="u-color-hint">ID:</span> {id}</p>
  </div>
  <div class="u-m-top-6">
    <button
      class="button button--primary"
      on:click={joinWorkspace}>
      Join workspace
    </button>
  </div>
</Layout>
