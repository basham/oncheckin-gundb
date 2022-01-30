<script>
  import { APP_NAME } from '@src/constants.js'
  import Upgrader from '@src/lib/upgrader.svelte'

  export let loaded = true
  export let notFound = false
  export let title = ''

  $: title = notFound ? ['Page not found'] : (Array.isArray(title) ? title : [title])
  $: fullTitle = [...title, APP_NAME].filter((v) => v).join(' - ')
</script>

<svelte:head>
  <title>{fullTitle}</title>
</svelte:head>

<Upgrader />

{#if loaded}
  <slot></slot>
{/if}
