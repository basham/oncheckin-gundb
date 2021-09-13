<script>
  import { init, map, store } from '../store.js'
  import Page from './page.svelte'

  let loading = true
  let name = ''
  let events = []
  let participants = []

  load()

  async function load () {
    await init()

    store.get('org').once((org) => {
      console.log('##', org)
      name = org?.name
    })

    /*
    const eventsMap = store.get('events').once().map().once((d, a) => {
      console.log('%', d, a)
    })
    console.log('#', eventsMap)
    */

    const eventsMap = await map(store.get('events'))
    events = eventsMap
      .sort((a, b) => {
        const [keyA, keyB] = [a, b]
          .map(({ date }) => new Date(date))
        return keyA < keyB ? 1 : keyA > keyB ? -1 : 0
      })

    const participantsMap = await map(store.get('participants'))
    participants = participantsMap
      .map((p) => {
        const fullName = `${p.firstName} ${p.lastName}`
        return { ...p, fullName }
      })

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
      <li><a href={`?p=event&id=${event.key}`}>{event.name}</a> ({event.date})</li>
    {/each}
  </ol>
  <h2>Participants ({participants.length})</h2>
  <ol>
    {#each participants as p}
      <li><a href={`?p=participant&id=${p.key}`}>{p.fullName}</a></li>
    {/each}
  </ol>
</Page>
