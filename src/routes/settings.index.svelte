<script>
  import { onMount } from 'svelte'
  import { workspaceStore } from '@src/stores.js'
  import Layout from '@src/layouts/workspace.svelte'

  const title = 'Settings'

  let loaded = false
  let status = {}
  let syncing = false
  let workspace

  onMount(async () => {
    workspace = await workspaceStore.get()
    status = await workspaceStore.syncStatus()
    loaded = true
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

<Layout
  loaded={loaded}
  location='settings'
  title={title}>
  <div class="card">
    <h1>{title}</h1>
    <ul class="list-inline u-m-top-4">
      <li><a href="?p=workspaces">Change workspace</a></li>
    </ul>
  </div>
  <div class="card u-m-top-6">
    <h2>This workspace</h2>
    <p class="u-m-top-2"><span class="u-color-hint">Name:</span> {workspace?.name}</p>
    <p><span class="u-color-hint">ID:</span> {workspace?.id}</p>
    <p><span class="u-color-hint">Pub link:</span> {workspace?.pub}</p>
    <ul class="list-inline u-m-top-4">
      <li><a href="?p=settings/share">Share</a></li>
      <li><a href="?p=settings/rename">Rename</a></li>
      <li><a href="?p=settings/edit-pub">Edit pub</a></li>
    </ul>
  </div>
  <div class="card u-m-top-6">
    <h2>Data</h2>
    <p class="u-m-top-2"><span class="u-color-hint">Last sync:</span> {status?.lastSyncDisplay}</p>
    <p>
      <span class="u-color-hint">Status:</span>
      <span role="status">{syncing ? 'Syncing…' : status?.unsyncedChanges ? 'Unsynced changes' : status?.lastSync ? 'All local changes are synced' : ''}</span>
    </p>
    <div class="u-m-top-4">
      <button
        class="button"
        disabled={syncing}
        on:click={sync}>
        Sync
      </button>
    </div>
  </div>
</Layout>
