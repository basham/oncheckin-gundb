<script>
  import { eventStore, participantStore } from '../stores.js'
  import Events from './events.svelte'
  import Page from './page.svelte'
  import Participants from './participants.svelte'

  let loading = true
  let events = []
  let upcomingEvents = []
  let participants = []

  load()

  async function load () {
    events = eventStore.getAll()
    upcomingEvents = eventStore.getUpcoming().slice(0, 3)
    participants = participantStore.getAll()
    loading = false
  }
</script>

<style>
  h2:first-child {
    margin-top: var(--size-3);
  }
</style>

<Page
  loading={loading}
  location='home'>
  <h2>Upcoming events</h2>
  <Events events={upcomingEvents} />
  <h2>Participants</h2>
  <Participants participants={participants} />
</Page>
