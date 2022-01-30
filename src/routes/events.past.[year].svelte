<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { eventStore } from '@src/stores.js'
  import Layout from '@src/layouts/workspace.svelte'
  import Events from '@src/lib/events.svelte'

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
  <div class="card">
    <h1>{title}</h1>
  </div>
  <div class="card u-m-top-6">
    <h2>{`Events (${events.length})`}</h2>
    <div class="u-m-top-4">
      <Events events={events} />
    </div>
  </div>
</Layout>
