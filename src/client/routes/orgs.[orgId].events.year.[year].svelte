<script>
  import { getContext } from 'svelte'
  import Layout from '@src/client/layouts/org.svelte'
  import Events from '@src/client/lib/events.svelte'

  const { heading, events } = getContext('data')
</script>

<Layout location='events'>
  <h1>{heading}</h1>
  <h2>Events <span class="badge">{events.length}</span></h2>
  <div class="u-m-top-2">
    <Events events={events} />
  </div>
</Layout>
