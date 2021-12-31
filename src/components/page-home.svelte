<script>
  import { eventStore, workspaceStore } from '../stores.js'
  import Events from './events.svelte'
  import Page from './page.svelte'

  const workspace = workspaceStore.get()
  let loading = true
  let upcomingEvents = []

  load()

  async function load () {
    upcomingEvents = eventStore.getUpcoming().slice(0, 3)
    loading = false
  }
</script>

<Page
  loading={loading}
  location='home'>
  <h1>{workspace?.name}</h1>
  <h2>{upcomingEvents.length ? 'Upcoming events' : 'No upcoming events'}</h2>
  <Events events={upcomingEvents} />
</Page>
