<script>
  import { orgStore } from '../stores.js'
  import Nav from './nav.svelte'
  import OfflineStatus from './offline-status.svelte'
  import Upgrader from './upgrader.svelte'

  export let loading = false
  export let location = ''
  export let notFound = false
  export let title = ''

  const appName = 'OnCheckIn'
  $: title = notFound ? ['Page not found'] : (Array.isArray(title) ? title : [title])
  $: fullTitle = [...title, appName].filter((v) => v).join(' - ')
  // $: focusOnHeading(loading)

  let orgName = orgStore.get()?.name

  function focusOnHeading (loading) {
    if (loading) return
    window.requestAnimationFrame(() => {
      const heading = document.querySelector('h1')
      if (!heading) return
      heading.setAttribute('tabindex', '-1')
      heading.focus()
      heading.removeAttribute('tabindex')
    })
  }

  setTimeout(() => focusOnHeading(loading), 100)
</script>

<style>
  header {
    align-items: center;
    background-color: var(--color-black);
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-2) var(--size-4);
    line-height: var(--lh-2);
    padding: var(--size-4);
  }

  main {
    padding: var(--size-4);
  }

  .loading {
    display: none;
  }
</style>

<svelte:head>
  <title>{fullTitle}</title>
</svelte:head>

<Upgrader />

<header>
  <strong>{appName}</strong>
  <span>{orgName}</span>
  <OfflineStatus />
</header>

<Nav location={location} />

<main class:loading={loading}>
  {#if notFound}
    <h1>{title}</h1>
  {:else}
    <slot></slot>
  {/if}
</main>
