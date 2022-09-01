<script>
  import { getContext } from 'svelte'
  import NavLink from '@src/client/lib/nav-link.svelte'
  import Layout from '@src/pages/orgs/$orgId/layout.svelte'

  const { route, event } = getContext('data')
  const location = route.split('.')[4]
</script>

<Layout>
  <h1>{event.name}</h1>
  <p class="u-m-top-2">{`#${event.count}: ${event.displayDateLong}`}</p>
  <nav class="list-plain list-plain--inline u-border-bottom u-gap-4 u-m-top-4 u-p-bottom-4">
    <NavLink
      href={event.url}
      id="check-ins"
      location={location}>
      Check-ins
    </NavLink>
    <NavLink
      href={`${event.url}checkpoint/`}
      id="checkpoint"
      location={location}>
      Checkpoint
    </NavLink>
    <NavLink
      href={`${event.url}circle/`}
      id="circle"
      location={location}>
      Circle
    </NavLink>
    <NavLink
      href={`${event.url}edit/`}
      id="edit"
      location={location}>
      Edit
    </NavLink>
  </nav>
  <slot></slot>
</Layout>
