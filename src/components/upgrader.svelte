<script>
  import { Workbox } from 'workbox-window'

  const states = {
    IDLE: 'idle',
    PROMPT: 'prompt',
    UPGRADING: 'upgrading'
  }
  let state = states.IDLE
  let wb = null

  try {
    wb = new Workbox('./service-worker.js')
    wb.addEventListener('waiting', (event) => {
      state = states.PROMPT
    })
    wb.register()
  } catch (e) {}

  function upgrade () {
    wb.addEventListener('controlling', (event) => {
      window.location.reload()
    })
    wb.messageSkipWaiting()
    state = states.UPGRADING
  }

  function dismiss () {
    state = states.IDLE
  }
</script>

<style>
  .prompt {
    align-items: center;
    background-color: var(--color-green);
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-2);
    justify-content: space-between;
    padding: var(--size-4);
  }

  .message {
    color: var(--color-base-95);
    font-size: var(--fs-2);
    font-weight: bold;
    line-height: var(--lh-2);
    padding: var(--size-1) 0;
  }

  .buttons {
    display: flex;
    gap: var(--size-4);
  }
</style>

{#if state === states.PROMPT}
  <div class="prompt">
    <div class="message">New version available</div>
    <div class="buttons">
      <button
        class="button button--light button--light-bg"
        on:click={upgrade}>
        Upgrade
      </button>
      <button
        aria-label="Dismiss"
        class="button button--light button--light-bg"
        on:click={dismiss}>
        <svg class="icon">
          <use xlink:href="../icons.svg#close" />
        </svg>
      </button>
    </div>
  </div>
{/if}

{#if state === states.UPGRADING}
  <div class="prompt">
    <div class="message">Upgrading&hellip;</div>
  </div>
{/if}
