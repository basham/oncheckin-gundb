<script>
  import { APP_NAME } from '../constants.js'
  import { orgStore } from '../stores.js'
  import Nav from './nav.svelte'
  import OfflineStatus from './offline-status.svelte'

  export let loading = false
  export let location = ''
  export let notFound = false
  export let title = ''

  let orgName = orgStore.get()?.name

  // $: focusOnHeading(loading)

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
    background-color: var(--color-base-100);
    display: flex;
    gap: 0 var(--size-4);
    line-height: var(--lh-2);
    padding: var(--size-2) var(--size-4);
  }

  .identity {
    align-items: center;
    display: flex;
    flex-grow: 1;
    flex-wrap: wrap;
    gap: 0 var(--size-4);
  }

  .logo {
    --size: 2.5rem;
    height: var(--size);
    width: var(--size);
  }

  main {
    padding: var(--size-6) var(--size-4);
  }

  .loading {
    display: none;
  }
</style>

<header>
  <span class="identity">
    <img
      alt={APP_NAME}
      class="logo"
      src="../icon.svg">
    <span>{orgName}</span>
  </span>
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
