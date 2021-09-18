<script>
  import { eventStore, orgStore, participantStore } from '../stores.js'
  import Events from './events.svelte'
  import Page from './page.svelte'
  import Participants from './participants.svelte'

  let loading = true
  let name = ''
  let events = []
  let upcomingEvents = []
  let participants = []

  load()

  async function load () {
    name = orgStore.get()?.name
    events = eventStore.getAll()
    upcomingEvents = eventStore.getUpcoming().slice(0, 3)
    participants = participantStore.getAll()
    loading = false
  }
</script>

<style>
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-2) var(--size-4);
    list-style-type: '';
    margin: var(--size-2) 0;
    padding: 0;
  }
</style>

<Page loading={loading}>
  <h1>{name}</h1>
  <ul class="toolbar">
    <li><a href="?p=events">Events ({events.length})</a></li>
    <li><a href="?p=participants">Participants ({participants.length})</a></li>
    <li><a href="?p=settings">Settings</a></li>
  </ul>
  <h2>Upcoming events</h2>
  <Events events={upcomingEvents} />
  <h2>Participants</h2>
  <Participants participants={participants} />
</Page>
