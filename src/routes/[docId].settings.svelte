<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { workspaceStore } from '@src/stores.js'
  import Layout from '@src/layouts/workspace.svelte'

  const title = 'Settings'
  const { docId } = getContext('params')

  let state = STATE.LOADING
  let status = {}
  let syncing = false
  let workspace

  onMount(async () => {
    workspace = await workspaceStore.get(docId)
    state = STATE.LOADED
  })

  async function sync () {
    if (syncing) {
      return
    }
    syncing = true
    location.reload()
  }
</script>

<Layout
  state={state}
  title={title}>
  <h1>{title}</h1>
  <p class="u-m-top-4">
    <a href="?p=workspaces">Change workspace</a>
  </p>
  <h2>This workspace</h2>
  <div class="card u-m-top-2">
    <p><span class="u-color-hint">Name:</span> {workspace?.name}</p>
    <p><span class="u-color-hint">ID:</span> {workspace?.id}</p>
    <ul class="list-plain list-plain--inline u-gap-4 u-m-top-4">
      <li><a href={`?p=${docId}/share`}>Share</a></li>
      <li><a href={`?p=${docId}/rename`}>Rename</a></li>
    </ul>
  </div>
  <h2>Data</h2>
  <div class="card u-m-top-2">
    <p><span class="u-color-hint">Last sync:</span> {status?.lastSyncDisplay}</p>
    <p>
      <span class="u-color-hint">Status:</span>
      <span role="status">{syncing ? 'Syncing…' : status?.unsyncedChanges ? 'Unsynced changes' : status?.lastSync ? 'All local changes are synced' : ''}</span>
    </p>
    <div class="u-m-top-4">
      <button
        class="button button--primary"
        disabled={syncing}
        on:click={sync}>
        Sync
      </button>
    </div>
  </div>
</Layout>
