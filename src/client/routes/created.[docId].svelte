<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { workspaceStore } from '@src/client/stores.js'
  import Layout from '@src/client/layouts/public.svelte'

  const { docId } = getContext('params')

  let state = STATE.LOADING
  let workspace

  onMount(async () => {
    workspace = await workspaceStore.get(docId)
    state = STATE.LOADED
  })

  function copyInviteLink () {

  }
</script>

<Layout
  state={state}
  title="Workspace created">
  <div class="group u-m-top-6">
    <h2 class="u-m-top-0">{workspace?.name}</h2>
    <p class="u-m-0"><span class="u-color-hint">ID:</span> {workspace?.id}</p>
    <p class="u-m-0"><span class="u-color-hint">Pub:</span> {workspace?.server}</p>
  </div>
  <details class="u-m-top-6">
    <summary>You should save this workspace's invite link</summary>
    <p>Now that the workspace is created, you should copy its invite link and save it in a safe place, like a password manager. This way, you can reopen this workspace in case the browser's data is cleared.</p>
    <div class="u-m-top-4">
      <button
        class="button"
        on:click={copyInviteLink}>
        Copy invite link
      </button>
    </div>
  </details>
  <div class="u-m-top-6">
    <a
      class="button button--primary"
      href={workspace.openUrl}>
      Open workspace
    </a>
  </div>
</Layout>
