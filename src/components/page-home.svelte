<script>
  import { eventStore, orgStore } from '../stores.js'
  import Events from './events.svelte'
  import Page from './page.svelte'

  let loading = true
  let orgName = ''
  let upcomingEvents = []

  load()

  async function load () {
    orgName = orgStore.get()?.name
    upcomingEvents = eventStore.getUpcoming().slice(0, 3)
    loading = false
  }
</script>

<Page
  loading={loading}
  location='home'>
  <h1>{orgName}</h1>
  <h2>{upcomingEvents.length ? 'Upcoming events' : 'No upcoming events'}</h2>
  <Events events={upcomingEvents} />
</Page>
