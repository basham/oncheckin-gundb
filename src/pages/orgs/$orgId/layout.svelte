<script>
  import { getContext } from 'svelte'
  import { APP_NAME } from '@src/constants.js'
  import NavLink from '@src/client/lib/nav-link.svelte'
  import Layout from '@src/pages/page.svelte'

  const { route, org } = getContext('data')
  const location = route.split('.')[2]

  let unsyncedChanges
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

<Layout>
  <header class="u-border-bottom">
    <div class="header layout-content">
      <span class="nav">
        <img
          alt={APP_NAME}
          class="logo"
          src="/icon.svg">
        <nav class="list-plain list-plain--inline u-gap-4">
          <NavLink
            href={org.url}
            id="events"
            location={location}>
            Events
          </NavLink>
          <NavLink
            href={`${org.url}participants/`}
            id="participants"
            location={location}>
            Hashers
          </NavLink>
          <NavLink
            href={`${org.url}settings/`}
            id="settings"
            location={location}>
            Settings
          </NavLink>
        </nav>
      </span>
      <span class="u-ts-2">
        {org.name}
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
