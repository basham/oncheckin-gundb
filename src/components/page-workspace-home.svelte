<script>
  import { onMount } from 'svelte'
  import { eventStore, workspaceStore } from '../stores.js'
  import Events from './events.svelte'
  import Page from './page.svelte'

  let workspace
  let loading = true
  let upcomingEvents = []

  onMount(async () => {
    workspace = await workspaceStore.get()
    upcomingEvents = (await eventStore.getUpcoming()).slice(0, 3)
    loading = false
  })
</script>

<Page
  loading={loading}
  location='home'
  title={workspace?.name}>
  <h1>{workspace?.name}</h1>
  <h2>{upcomingEvents.length ? 'Upcoming events' : 'No upcoming events'}</h2>
  <Events events={upcomingEvents} />
</Page>
