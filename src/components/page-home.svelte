<script>
  import { eventStore, orgStore, participantStore } from '../stores.js'
  import Events from './events.svelte'
  import Page from './page.svelte'

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
  .participant-list {
    display: flex;
    flex-direction: column;
    font-size: var(--fs-2);
    gap: var(--size-2);
    list-style-type: '';
    margin: 0;
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
  <h2>Events ({events.length})</h2>
  <p><a href="?p=events">All events</a></p>
  <Events events={events} />
  <h2>Participants ({participants.length})</h2>
  <ol class="participant-list">
    {#each participants as p}
      <li><a href={`?p=participant&id=${p.id}`}>{p.fullName}</a></li>
    {/each}
  </ol>
</Page>
