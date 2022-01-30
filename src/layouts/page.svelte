<script>
  import { APP_NAME, STATE } from '@src/constants.js'
  import Upgrader from '@src/lib/upgrader.svelte'

  export let state
  export let title = ''

  const NOT_FOUND_TITLE = 'Page not found'

  $: _state = getState(state)
  $: title = _state === STATE.NOT_FOUND ? [NOT_FOUND_TITLE] : (Array.isArray(title) ? title : [title])
  $: fullTitle = [...title, APP_NAME].filter((v) => v).join(' - ')

  function getState (source) {
    const state = Array.isArray(source) ? source : [source]
    const all = state.flat(Infinity)
    if (all.some((s) => s === STATE.NOT_FOUND)) {
      return STATE.NOT_FOUND
    }
    if (all.some((s) => s === STATE.LOADING)) {
      return STATE.LOADING
    }
    return STATE.LOADED
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
  <h1>{NOT_FOUND_TITLE}</h1>
{/if}
