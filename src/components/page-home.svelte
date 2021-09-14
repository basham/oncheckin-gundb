<script>
  import { get, getAll, init } from '../store.js'
  import Page from './page.svelte'

  let loading = true
  let name = ''
  let events = []
  let participants = []

  load()

  async function load () {
    await init()

    const org = await get('org')
    name = org.data?.name

    events = (await getAll('events'))
      .sort((a, b) => {
        const [keyA, keyB] = [a, b]
          .map(({ data }) => new Date(data.date))
        return keyA < keyB ? 1 : keyA > keyB ? -1 : 0
      })

    participants = (await getAll('participants'))
      .map((p) => {
        const { firstName, lastName } = p.data
        const fullName = `${firstName} ${lastName}`
        const data = { ...p.data, fullName }
        return { ...p, data }
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
      <li><a href={`?p=event&id=${event.key}`}>{event.data.name}</a> ({event.data.date})</li>
    {/each}
  </ol>
  <h2>Participants ({participants.length})</h2>
  <ol>
    {#each participants as p}
      <li><a href={`?p=participant&id=${p.key}`}>{p.data.fullName}</a></li>
    {/each}
  </ol>
</Page>
