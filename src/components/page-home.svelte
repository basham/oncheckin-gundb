<script>
  import { eventStore, orgStore, participantStore } from '../stores.js'
  import Events from './events.svelte'
  import Page from './page.svelte'
  import Participants from './participants.svelte'

  let loading = true
  let name = ''
  let events = []
  let participants = []

  load()

  async function load () {
    name = orgStore.get()?.name
    events = eventStore.getAll()
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
  <h1>
    {#if name}
      {name}
    {:else}
      <em>Organization</em>
    {/if}
  </h1>
  <ul class="toolbar">
    <li><a href="?p=edit-org">Edit</a></li>
    <li><a href="?p=new-event">New event</a></li>
    <li><a href="?p=new-participant">New participant</a></li>
  </ul>
  <ul class="toolbar">
    <li><a href="?p=events">Events ({events.length})</a></li>
    <li><a href="?p=participants">Participants ({participants.length})</a></li>
  </ul>
  <h2>Events</h2>
  <Events events={events} />
  <h2>Participants</h2>
  <Participants participants={participants} />
</Page>
