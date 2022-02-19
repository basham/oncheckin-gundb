<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { eventStore } from '@src/stores.js'
  import NavLink from '@src/lib/nav-link.svelte'
  import Layout from './workspace.svelte'

  export let state = STATE.LOADED
  export let title = ''

  const params = getContext('params')
  const route = getContext('route')

  let event = null
  let _state = STATE.LOADING
  let _title

  onMount(async () => {
    event = await eventStore.get(params.id)
    if (!event) {
      _state = STATE.NOT_FOUND
      return
    }
    _title = `${title ? `${title}: ` : ''}${event?.name} (#${event?.count}: ${event?.displayDate})`
    _state = STATE.LOADED
  })
</script>

<Layout
  state={[state, _state]}
  title={_title}>
  <h1>{event.name}</h1>
  <p class="u-m-top-2">{`#${event.count}: ${event?.displayDateLong}`}</p>
  <nav class="list-inline u-border-bottom u-m-top-4 u-p-bottom-4">
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
    <NavLink href={`${event.url}/roster`}>
      Roster
    </NavLink>
    <NavLink
      href={`${event.url}/edit`}
      id="events/[id]/edit"
      location={route}>
      Edit
    </NavLink>
  </nav>
  <slot></slot>
</Layout>
