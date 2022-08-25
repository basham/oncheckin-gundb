<script>
  import { getContext, onMount } from 'svelte'
  import { APP_NAME, STATE } from '@src/constants.js'
  import { workspaceStore } from '@src/client/stores.js'
  import NavLink from '@src/client/lib/nav-link.svelte'
  import Layout from './page.svelte'

  export let state = STATE.LOADED
  export let title = ''

  const { docId } = getContext('params')
  const route = getContext('route')
  const location = route.split('/')[1]

  let _state = STATE.LOADING
  let workspace
  let unsyncedChanges

  onMount(async () => {
    workspace = await workspaceStore.get(docId)
    _state = STATE.LOADED
  })
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
  title={[title, workspace?.name]}>
  <header class="u-border-bottom">
    <div class="header layout-content">
      <span class="nav">
        <img
          alt={APP_NAME}
          class="logo"
          src="../icon.svg">
        <nav class="list-plain list-plain--inline u-gap-4">
          <NavLink
            href={`?p=${docId}/events`}
            id="events"
            location={location}>
            Events
          </NavLink>
          <NavLink
            href={`?p=${docId}/participants`}
            id="participants"
            location={location}>
            Hashers
          </NavLink>
          <NavLink
            href={`?p=${docId}/settings`}
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
  <main class="layout-content u-p-bottom-6">
    <slot></slot>
  </main>
</Layout>
