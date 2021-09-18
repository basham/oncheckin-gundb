<script>
  import { participantStore, attendanceStore } from '../stores.js'
  import { pluralize } from '../util.js'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const participantId = params.get('id')

  let title = ''
  let loading = true
  let notFound = false
  let events = []
  let eventCount = 0
  let hostCount = 0

  load()

  async function load () {
    const participant = participantStore.get(participantId)
    title = participant?.fullName
    notFound = !participant

    events = attendanceStore.getEvents(participantId)
    eventCount = events.length
    hostCount = events
      .filter(({ isHost }) => isHost)
      .length

    loading = false
  }
</script>

<Page
  loading={loading}
  notFound={notFound}
  title={title}>
  <h1>{title}</h1>
  <p>{eventCount} {pluralize(eventCount, 'event')}, {hostCount} {pluralize(hostCount, 'host')}</p>
  <p><a href={`?p=edit-participant&id=${participantId}`}>Edit</a></p>
  <h2>{events.length ? 'Events' : 'No events'}</h2>
  <ul>
    {#each events as event}
      <li>
        <a href={event.url}>{event.name}</a>
        ({event.displayDate})
        {#if event.isHost}
          Host
        {/if}
      </li>
    {/each}
  </ul>
</Page>
