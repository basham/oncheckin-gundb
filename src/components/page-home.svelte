<script>
  import { gun } from '../gun.js'
  import Page from './page.svelte'

  let loading = true
  let name = ''

  gun.get('org').once((data) => {
    if (data) {
      name = data.name
    }
    loading = false
  })

  let events = []
  gun.get('events').map().once((data, key) => {
    if (data) {
      events.push({ ...data, key })
      events = events
    }
  })
  $: events = events.sort((a, b) => {
    const keyA = new Date(a.date)
    const keyB = new Date(b.date)
    return keyA < keyB ? 1 : keyA > keyB ? -1 : 0
  })
</script>

<Page loading={loading}>
  {#if name}
    <h1>{name}</h1>
  {:else}
    <h1><em>Organization</em></h1>
  {/if}
  <ul>
    <li><a href="?p=edit-org">Edit</a></li>
    <li><a href="?p=new-event">New event</a></li>
  </ul>
  <h2>Events ({events.length})</h2>
  <ol>
    {#each events as event}
      <li><a href={`?p=event&id=${event.key}`}>{event.name}</a> ({event.date})</li>
    {/each}
  </ol>
</Page>
