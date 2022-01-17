<script>
  import { workspaceStore } from '../stores.js'

  const retryTime = 1000
  let offline = true
  const syncer = workspaceStore.getSyncer()
  workspaceStore.sync()
  checkConnection(syncer)

  function checkConnection (syncer) {
    offline = !syncer.state.isPushStreaming
    if (syncer.pullStream) {
      syncer.pullStream.addEventListener('error', (e) => {
        offline = true
      })
      syncer.pullStream.addEventListener('message', (e) => {
        offline = false
        syncer.syncOnceAndContinueLive()
      })
    } else {
      setTimeout(() => checkConnection(syncer), retryTime)
    }
  }
</script>

<style>
  .status {
    background-color: var(--color-base-50);
    border-radius: var(--size-3);
    color: var(--color-base-95);
    line-height: var(--lh-2);
    padding: 0 var(--size-2);
    visibility: hidden;
  }

  .status--offline {
    visibility: visible;
  }
</style>

<span
  class="status"
  class:status--offline={offline}>
  Offline
</span>
