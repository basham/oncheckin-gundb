<script>
  import { workspaceStore } from '../stores.js'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const workspaceId = params.get('id')

  let loading = true
  let workspace

  onMount(async () => {
    workspace = await workspaceStore.get(workspaceId)
    loading = false
  })

  function copyInviteLink () {

  }
</script>

<Page
  loading={loading}
  theme="app"
  title="Workspace created">
  <div class="group u-m-top-6">
    <h2 class="u-m-top-0">{workspace?.name}</h2>
    <p class="u-m-0"><span class="u-color-hint">ID:</span> {workspace?.id}</p>
    <p class="u-m-0"><span class="u-color-hint">Pub:</span> {workspace?.pub}</p>
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
</Page>
