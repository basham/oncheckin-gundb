<script>
  import { syncer } from '../stores.js'

  const retryTime = 1000
  let offline = true

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
    border-radius: var(--size-1);
    color: var(--color-black);
    line-height: var(--lh-2);
    padding: 0 var(--size-1);
  }
</style>

{#if offline}
  <span class="status">Offline</span>
{/if}
