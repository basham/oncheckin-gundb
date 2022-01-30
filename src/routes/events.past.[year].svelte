<script>
  import { onMount } from 'svelte'
  import { eventStore } from '@src/stores.js'
  import Layout from '@src/layouts/workspace.svelte'
  import Events from '@src/lib/events.svelte'

  export let params
  export let route

  const title = `Events in ${params.year}`

  let loaded = false
  let events = []

  onMount(async () => {
    events = (await eventStore.getAll())
      .filter((event) => event.year === params.year)
      .reverse()
    loaded = true
  })
</script>

<Layout
  loaded={loaded}
  location='events'
  params={params}
  route={route}
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
