<script>
  import { gun, map } from '../gun.js'
  import Page from './page.svelte'

  let loading = true
  let name = ''
  let events = []

  async function load () {
    const org = await gun.get('org').then()
    name = org?.name

    const eventsMap = await map(gun.get('events'))
    events = eventsMap
      .sort((a, b) => {
        const [keyA, keyB] = [a, b]
          .map(({ date }) => new Date(date))
        return keyA < keyB ? 1 : keyA > keyB ? -1 : 0
      })

    loading = false
  }

  load()
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
  </ul>
  <h2>Events ({events.length})</h2>
  <ol>
    {#each events as event}
      <li><a href={`?p=event&id=${event.key}`}>{event.name}</a> ({event.date})</li>
    {/each}
  </ol>
</Page>
