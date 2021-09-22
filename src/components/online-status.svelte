<script>
  import { syncer } from '../stores.js'

  let offline = true

  checkConnection(syncer)

  function checkConnection (syncer) {
    if (syncer.pullStream) {
      offline = false
      syncer.pullStream.addEventListener('error', (e) => {
        offline = true
      })
      syncer.pullStream.addEventListener('message', (e) => {
        offline = false
      })
    } else {
      offline = true
      setTimeout(() => checkConnection(syncer), 1000)
    }
  }
</script>

<style>
  .status {
    --size: calc(12rem/16);
    border: var(--px-2) solid var(--color-black-2);
    border-radius: 50%;
    height: var(--size);
    width: var(--size);
  }
  .status--online {
    background-color: var(--color-green);
    border-color: var(--color-green);
  }
</style>

{#if offline}
  <span class="status"></span>
  <span class="u-sr-only">Offline</span>
{:else}
  <span class="status status--online"></span>
  <span class="u-sr-only">Online</span>
{/if}
