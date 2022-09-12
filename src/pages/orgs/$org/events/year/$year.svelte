<script>
  import { h1, events } from '@src/data.js'
  import Layout from '@src/pages/orgs/$org/layout.svelte'
  import Events from '@src/lib/events.svelte'
</script>

<Layout location='events'>
  <h1>{h1}</h1>
  <h2>Events <span class="badge">{events.length}</span></h2>
  <div class="u-m-top-2">
    <Events events={events} />
  </div>
</Layout>
