<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { eventStore } from '@src/client/stores.js'
  import NavLink from '@src/client/lib/nav-link.svelte'
  import Layout from './org.svelte'

  export let state = STATE.LOADED
  export let title = ''

  const { docId, eventId } = getContext('params')
  const route = getContext('route')
  const location = route.split('/')[3]

  let event = null
  let _state = STATE.LOADING

  onMount(async () => {
    event = await eventStore.get(docId, eventId)
    if (!event) {
      _state = STATE.NOT_FOUND
      return
    }
    _state = STATE.LOADED
  })
</script>

<Layout
  state={[state, _state]}
  title={[title, event?.name]}>
  <h1>{event.name}</h1>
  <p class="u-m-top-2">{`#${event.count}: ${event?.displayDateLong}`}</p>
  <nav class="list-plain list-plain--inline u-border-bottom u-gap-4 u-m-top-4 u-p-bottom-4">
    <NavLink
      href={event.url}
      id="check-ins"
      location={location === 'index' ? 'check-ins' : location}>
      Check-ins
    </NavLink>
    <NavLink
      href={`${event.url}/checkpoint`}
      id="checkpoint"
      location={location}>
      Checkpoint
    </NavLink>
    <NavLink
      href={`${event.url}/circle`}
      id="circle"
      location={location}>
      Circle
    </NavLink>
    <NavLink
      href={`${event.url}/edit`}
      id="edit"
      location={location}>
      Edit
    </NavLink>
  </nav>
  <slot></slot>
</Layout>
