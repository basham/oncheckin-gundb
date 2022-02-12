<script>
  import { getContext, onMount } from 'svelte'
  import { APP_NAME, STATE } from '@src/constants.js'
  import { workspaceStore } from '@src/stores.js'
  import NavLink from '@src/lib/nav-link.svelte'
  import Layout from './page.svelte'

  export let state = STATE.LOADED
  export let title = ''

  const route = getContext('route')
  const location = route.split('/')[0]

  let _state = STATE.LOADING
  let workspace
  let unsyncedChanges

  onMount(async () => {
    workspace = await workspaceStore.get()
    const syncStatus = await workspaceStore.syncStatus()
    unsyncedChanges = syncStatus.unsyncedChanges
    _state = STATE.LOADED
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
  .header {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-4);
  }

  .nav {
    align-items: center;
    display: flex;
    flex-grow: 1;
    flex-wrap: wrap;
    gap: var(--size-4);
  }

  .logo {
    --size: 2.5rem;
    height: var(--size);
    width: var(--size);
  }
</style>

<Layout
  state={[state, _state]}
  title={title}>
  <header class="u-border-bottom">
    <div class="header layout-content">
      <span class="nav">
        <img
          alt={APP_NAME}
          class="logo"
          src="../icon.svg">
        <nav class="list-inline">
          <NavLink
            href="?p=events"
            id="events"
            location={location}>
            Runs
          </NavLink>
          <NavLink
            href="?p=participants"
            id="participants"
            location={location}>
            Hashers
          </NavLink>
          <NavLink
            href="?p=settings"
            id="settings"
            location={location}>
            Settings
          </NavLink>
        </nav>
      </span>
      <span class="u-ts-2">
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
    </div>
  </header>
  <main class="layout-content u-p-top-6 u-p-bottom-6">
    <slot></slot>
  </main>
</Layout>
