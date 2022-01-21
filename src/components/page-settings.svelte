<script>
  import { onMount } from 'svelte'
  import Page from './page.svelte'
  import { workspaceStore } from '../stores.js'

  const title = 'Settings'

  let loading = true
  let status = {}
  let syncing = false
  let workspace

  onMount(async () => {
    workspace = await workspaceStore.get()
    status = await workspaceStore.syncStatus()
    loading = false
  })

  async function sync () {
    if (syncing) {
      return
    }
    syncing = true
    await workspaceStore.syncOnce()
    location.reload()
  }
</script>

<Page
  loading={loading}
  location='settings'
  title={title}>
  <h1>{title}</h1>
  <ul class="list-inline">
    <li><a href="?p=workspaces">Change workspace</a></li>
  </ul>
  <h2>This workspace</h2>
  <p class="u-m-0"><span class="u-color-hint">Name:</span> {workspace?.name}</p>
  <p class="u-m-0"><span class="u-color-hint">ID:</span> {workspace?.id}</p>
  <p class="u-m-0"><span class="u-color-hint">Pub link:</span> {workspace?.pub}</p>
  <ul class="list-inline u-m-bottom-0">
    <li><a href="?p=share">Share</a></li>
    <li><a href="?p=rename-workspace">Rename</a></li>
    <li><a href="?p=edit-pub">Edit pub</a></li>
  </ul>
  <h2>Data</h2>
  <p class="u-m-0"><span class="u-color-hint">Last sync:</span> {status?.lastSyncDisplay}</p>
  <p class="u-m-0">
    <span class="u-color-hint">Status:</span>
    <span role="status">{syncing ? 'Syncing…' : status?.unsyncedChanges ? 'Unsynced changes' : status?.lastSync ? 'All local changes are synced' : ''}</span>
  </p>
  <div class="u-m-top-4">
    <button
      class="button button--small"
      disabled={syncing}
      on:click={sync}>
      Sync
    </button>
  </div>
</Page>
