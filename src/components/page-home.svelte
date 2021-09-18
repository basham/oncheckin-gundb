<script>
  import { eventStore, orgStore, participantStore } from '../stores.js'
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
  .event-list {
    list-style-type: '';
    margin: 0;
    padding: 0;
  }
  .event-list__item {
    padding: var(--size-2) 0;
  }
  .event-list__link {
    display: block;
    text-decoration: none;
  }
  .event-list__link:hover {
    text-decoration: underline;
  }
  .event-list__date {
    display: block;
    color: var(--color-black-9);
  }
  .event-list__name {
    font-size: var(--fs-2);
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
  <ol class="event-list">
    {#each events as event}
      <li class="event-list__item">
        <a class="event-list__link" href={`?p=event&id=${event.id}`}>
          <span class="event-list__name">{event.name}</span>
          <span class="event-list__date">{event.displayDate}</span>
        </a>
      </li>
    {/each}
  </ol>
  <h2>Participants ({participants.length})</h2>
  <ol class="participant-list">
    {#each participants as p}
      <li><a href={`?p=participant&id=${p.id}`}>{p.fullName}</a></li>
    {/each}
  </ol>
</Page>
