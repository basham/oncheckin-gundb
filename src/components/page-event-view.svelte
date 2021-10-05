<script>
  import { checkInStore, eventStore } from '../stores.js'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const eventId = params.get('id')

  let title = ''
  let loading = true
  let notFound = false
  let event = null
  let checkIns = []

  load()

  async function load () {
    event = eventStore.get(eventId)
    title = `${event?.name} (${event?.displayDate})`
    notFound = !event
    checkIns = checkInStore.getEventCheckIns(eventId)
    loading = false
  }
</script>

<Page
  loading={loading}
  location='events'
  notFound={notFound}
  title={title}>
  <h1>{event?.name}</h1>
  <p>{event?.displayDate}</p>
  <ul class="list-inline">
    <li><a href={`?p=new-check-in&id=${eventId}`}>New check-in</a></li>
    <li><a href={`?p=edit-event&id=${eventId}`}>Edit event</a></li>
  </ul>
  <h2>{checkIns.length ? 'Check-ins' : 'No check-ins'}</h2>
  <ul>
    {#each checkIns as checkIn}
      <li>
        <a href={checkIn.url}>{checkIn.participant.displayName}</a>
        {#if checkIn.host}
          Host
        {/if}
      </li>
    {/each}
  </ul>
</Page>
