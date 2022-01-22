<script>
  import { onMount } from 'svelte'
  import { APP_NAME } from '../constants.js'
  import { workspaceStore } from '../stores.js'
  import Nav from './nav.svelte'

  export let location = ''
  export let notFound = false
  export let title = ''

  let loaded = false
  let workspace
  let unsyncedChanges

  onMount(async () => {
    workspace = await workspaceStore.get()
    const syncStatus = await workspaceStore.syncStatus()
    unsyncedChanges = syncStatus.unsyncedChanges
    loaded = true
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
    border-bottom: var(--px-2) solid var(--color-base-100);
    display: flex;
    flex-wrap: wrap;
    gap: 0 var(--size-2);
    line-height: var(--lh-2);
  }

  .left {
    align-items: center;
    display: flex;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0 var(--size-4);
  }

  .identity {
    font-size: var(--fs-2);
    padding: 0 var(--size-4);
  }

  .logo {
    --size: 2.5rem;
    height: var(--size);
    width: var(--size);
  }
</style>

{#if loaded}
  <header>
    <span class="left">
      <img
        alt={APP_NAME}
        class="logo"
        src="../icon.svg">
      <Nav location={location} />
    </span>
    <span class="identity">
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
  </header>
  <main>
    {#if notFound}
      <h1>{title}</h1>
    {:else}
      <slot></slot>
    {/if}
  </main>
{/if}
