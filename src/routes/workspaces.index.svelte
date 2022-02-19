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
  <div class="u-m-top-6">
    <a class="button button--primary" href="?p=workspaces/new">New workspace</a>
  </div>
  <details class="u-m-top-6">
    <summary>Join a workspace</summary>
    <p class="u-m-top-4">Join an existing workspace with an invite link or by scanning a QR&nbsp;code on someone else's device.</p>
  </details>
  {#if workspaces.length}
    <h2>All workspaces</h2>
    <ul class="link-list u-m-top-2">
      {#each workspaces as workspace}
        <li>
          <a
            class="link-item"
            href={workspace.openUrl}>
            <span class="link-item__primary">{workspace.name}</span>
            <span class="link-item__secondary">{`ID: ${workspace.id}`}</span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</Layout>
