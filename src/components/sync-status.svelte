<script>
  import { format, isToday } from 'date-fns'
  import safeAwait from 'safe-await'
  import { onMount } from 'svelte'
  import { workspaceStore } from '../stores.js'

  /*
  onMount(async () => {
    workspace = await workspaceStore.get()
    const [err, res] = await safeAwait(fetch(workspace.apiPathsUrl))
    if (err || !res.ok) {
      return
    }
    const paths = await res.json()
    const pathsCount = Object.keys(paths).length
    console.log('###', pathsCount)
  })
  */

  let syncing = false
  let lastLocalUpdate
  let lastSync
  $: unsyncedChanges = lastLocalUpdate > lastSync
  $: lastSyncDisplay = lastSync ? format(lastSync, isToday(lastSync) ? 'p' : 'PP') : ''

  onMount(async () => {
    const { storage } = await workspaceStore.get()
    lastLocalUpdate = await storage.getConfig('last-local-update')
    const lastRemoteUpdate = await storage.getConfig('last-remote-update')
    lastSync = await storage.getConfig('last-sync')
  })

  async function sync () {
    if (syncing) {
      return
    }
    syncing = true
    const sync = await workspaceStore.syncOnce()
    lastSync = sync.lastSync
    syncing = false
  }
</script>

<style>
  div {
    align-items: center;
    display: flex;
    gap: 0 var(--size-4);
  }
</style>

<div>
  <span
    class="u-ts-0 u-color-hint"
    role="status">
    {syncing ? 'Syncing…' : unsyncedChanges ? '(Unsynced)' : lastSync ? `Last sync: ${lastSyncDisplay}` : ''}
  </span>
  <button
    class="button button--small"
    disabled={syncing}
    on:click={sync}>
    Sync
  </button>
</div>
