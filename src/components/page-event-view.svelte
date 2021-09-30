<script>
  import { attendanceStore, eventStore } from '../stores.js'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const eventId = params.get('id')

  let title = ''
  let loading = true
  let notFound = false
  let name = ''
  let date = ''
  let participants = []

  load()

  async function load () {
    const event = eventStore.get(eventId)
    name = event?.name
    date = event?.displayDate
    title = `${name} (${date})`
    notFound = !event

    participants = attendanceStore.getAttendees(eventId)

    loading = false
  }
</script>

<Page
  loading={loading}
  location='events'
  notFound={notFound}
  title={title}>
  <h1>{name}</h1>
  <p>{date}</p>
  <ul class="list-inline">
    <li><a href={`?p=new-check-in&id=${eventId}`}>New check-in</a></li>
    <li><a href={`?p=edit-event&id=${eventId}`}>Edit event</a></li>
    <li><a href={`?p=edit-attendance&id=${eventId}`}>Edit attendance</a></li>
  </ul>
  <h2>{participants.length ? 'Check-ins' : 'No check-ins'}</h2>
  <ul>
    {#each participants as participant}
      <li>
        <a href={participant.checkInUrl}>{participant.displayName}</a>
        {#if participant.isHost}
          Host
        {/if}
      </li>
    {/each}
  </ul>
</Page>
