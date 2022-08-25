<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { eventStore } from '@src/client/stores.js'
  import Layout from '@src/client/layouts/workspace.svelte'
  import Events from '@src/client/lib/events.svelte'

  const params = getContext('params')
  const title = `Events in ${params.year}`

  let state = STATE.LOADING
  let events = []

  onMount(async () => {
    events = (await eventStore.getAll())
      .filter((event) => event.year === params.year)
      .reverse()
    state = STATE.LOADED
  })
</script>

<Layout
  state={state}
  location='events'
  title={title}>
  <h1>{title}</h1>
  <h2>Events <span class="badge">{events.length}</span></h2>
  <div class="u-m-top-2">
    <Events events={events} />
  </div>
</Layout>
