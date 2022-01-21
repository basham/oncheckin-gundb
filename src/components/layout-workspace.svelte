<script>
  import { onMount } from 'svelte'
  import { APP_NAME } from '../constants.js'
  import { workspaceStore } from '../stores.js'
  import Nav from './nav.svelte'

  export let location = ''
  export let notFound = false
  export let title = ''

  let workspace
  let unsyncedChanges

  onMount(async () => {
    workspace = await workspaceStore.get()
    const syncStatus = await workspaceStore.syncStatus()
    unsyncedChanges = syncStatus.unsyncedChanges
    focusOnHeading()
  })

  function focusOnHeading () {
    window.requestAnimationFrame(() => {
      const heading = document.querySelector('h1')
      if (!heading) return
      heading.setAttribute('tabindex', '-1')
      heading.focus()
      heading.removeAttribute('tabindex')
    })
  }
</script>

<style>
  header {
    align-items: center;
    background-color: var(--color-base-100);
    display: flex;
    flex-wrap: wrap;
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
</style>

<header>
  <span class="identity">
    <img
      alt={APP_NAME}
      class="logo"
      src="../icon.svg">
    <span>
      {workspace?.name}
      {#if unsyncedChanges}
        <strong
          aria-hidden="true"
          class="u-color-ix">
          *
        </strong>
        <span class="u-sr-only">(unsynced changes)</span>
      {/if}
    </span>
  </span>
</header>

<Nav location={location} />

<main>
  {#if notFound}
    <h1>{title}</h1>
  {:else}
    <slot></slot>
  {/if}
</main>
