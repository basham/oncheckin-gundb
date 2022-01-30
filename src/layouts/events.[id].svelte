<script>
  import { onMount } from 'svelte'
  import { eventStore } from '@src/stores.js'
  import NavLink from '@src/lib/nav-link.svelte'
  import Layout from './workspace.svelte'

  export let loaded = true
  export let params
  export let route
  export let title = ''

  let event = null
  let _loaded = true
  let notFound = false
  let _title

  onMount(async () => {
    event = await eventStore.get(params.id)
    notFound = !event
    _title = `${title ? `${title}: ` : ''}${event?.name} (${event?.displayDate})`
    _loaded = true
  })
</script>

<Layout
  loaded={loaded && _loaded}
  location='events'
  notFound={notFound}
  title={_title}>
  <div class="card">
    <h1>{event?.name}</h1>
    <p class="u-m-top-2">{event?.displayDateLong}</p>
    <nav class="list-inline u-m-top-4">
      <NavLink
        href={event.url}
        id="events/[id]/index"
        location={route}>
        Check-ins
      </NavLink>
      <NavLink
        href={`${event.url}/circle`}
        id="events/[id]/circle"
        location={route}>
        Circle
      </NavLink>
      <NavLink href={`?p=roster&id=${event?.id}`}>
        Print
      </NavLink>
      <NavLink
        href={`${event.url}/edit`}
        id="events/[id]/edit"
        location={route}>
        Edit
      </NavLink>
    </nav>
  </div>
  <slot></slot>
</Layout>
