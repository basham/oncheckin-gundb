<script>
  import { eventStore } from '../stores.js'
  import Events from './events.svelte'
  import Page from './page.svelte'

  const title = 'Events'

  let loading = true
  let events = []
  let upcomingEvents = []
  let pastEvents = []

  load()

  async function load () {
    events = eventStore.getAll()
    upcomingEvents = eventStore.getUpcoming()
    pastEvents = eventStore.getPast()
    loading = false
  }
</script>

<Page
  loading={loading}
  location='events'
  title={title}>
  <h1>{title}</h1>
  <ul class="list-inline">
    <li><a href="?p=new-event">New event</a></li>
  </ul>
  <h2>{`Upcoming events (${upcomingEvents.length})`}</h2>
  <Events events={upcomingEvents} />
  <h2>{`Past events (${pastEvents.length})`}</h2>
  <Events events={pastEvents} />
</Page>
