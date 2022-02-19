<script>
  import { APP_NAME, STATE } from '@src/constants.js'
  import Upgrader from '@src/lib/upgrader.svelte'

  export let state = STATE.LOADED
  export let title = ''

  const NOT_FOUND_TITLE = 'Page not found'

  $: [_state, _title] = getState(state)
  $: fullTitle = [_title, APP_NAME].flat(Infinity).filter((v) => v).join(' \u00b7 ')

  function getState (source) {
    const all = [source].flat(Infinity)
    if (all.some((s) => s === STATE.NOT_FOUND)) {
      return [STATE.NOT_FOUND, NOT_FOUND_TITLE]
    }
    if (all.some((s) => s === STATE.LOADING)) {
      return [STATE.LOADING, null]
    }
    return [STATE.LOADED, title]
  }
</script>

<svelte:head>
  <title>{fullTitle}</title>
</svelte:head>

<Upgrader />

{#if _state === STATE.LOADED}
  <slot></slot>
{/if}

{#if _state === STATE.NOT_FOUND}
  <main class="u-p-8">
    <h1>{NOT_FOUND_TITLE}</h1>
  </main>
{/if}
