<script>
  import { get, getEvents, getParticipants } from '../earthstar.js'
  import Page from './page.svelte'

  let loading = true
  let name = ''
  let events = []
  let participants = []

  load()

  async function load () {
    name = get('org/name.txt')
    events = getEvents()
    participants = getParticipants()
    loading = false
  }
</script>

<Page loading={loading}>
  <h1>
    {#if name}
      {name}
    {:else}
      <em>Organization</em>
    {/if}
  </h1>
  <ul>
    <li><a href="?p=edit-org">Edit</a></li>
    <li><a href="?p=new-event">New event</a></li>
    <li><a href="?p=new-participant">New participant</a></li>
  </ul>
  <h2>Events ({events.length})</h2>
  <ol>
    {#each events as event}
      <li><a href={`?p=event&id=${event.id}`}>{event.name}</a> ({event.displayDate})</li>
    {/each}
  </ol>
  <h2>Participants ({participants.length})</h2>
  <ol>
    {#each participants as p}
      <li><a href={`?p=participant&id=${p.id}`}>{p.fullName}</a></li>
    {/each}
  </ol>
</Page>
