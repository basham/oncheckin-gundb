<script>
  import { getContext } from 'svelte'
  import Layout from '@src/pages/orgs/$orgId/layout.svelte'
  import Events from '@src/client/lib/events.svelte'

  const { h1, events } = getContext('data')
</script>

<Layout location='events'>
  <h1>{h1}</h1>
  <h2>Events <span class="badge">{events.length}</span></h2>
  <div class="u-m-top-2">
    <Events events={events} />
  </div>
</Layout>
