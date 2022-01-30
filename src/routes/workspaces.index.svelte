<script>
  import { onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { workspaceStore } from '@src/stores.js'
  import Layout from '@src/layouts/public.svelte'

  let state = STATE.LOADING
  let workspaces = []

  onMount(async () => {
    workspaces = await workspaceStore.getAll()
    state = STATE.LOADED
  })
</script>

<Layout
  state={state}
  title="Workspaces">
  <ul class="list-inline u-m-top-2">
    <li><a href="?p=workspaces/new">New workspace</a></li>
  </ul>
  <details class="u-m-top-6">
    <summary>Join a workspace</summary>
    <p class="u-m-top-4">Join an existing workspace with an invite link or by scanning a QR&nbsp;code on someone else's device.</p>
  </details>
  {#each workspaces as workspace}
    <h2 class="u-m-bottom-0">
      <a
        class="u-ts-2"
        href={workspace.openUrl}>
        {workspace.name}
      </a>
    </h2>
    <p class="u-m-top-0">ID: {workspace.id}</p>
  {/each}
</Layout>
