<script>
  import { checkInStore, participantStore } from '../stores.js'
  import { pluralize } from '../util.js'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const participantId = params.get('id')

  let title = ''
  let loading = true
  let notFound = false
  let fullName = ''
  let checkIns = []
  let eventCount = 0
  let hostCount = 0

  load()

  async function load () {
    const participant = participantStore.get(participantId)
    title = participant?.displayName
    notFound = !participant
    fullName = participant?.fullName

    checkIns = checkInStore.getParticipantCheckIns(participantId)
    eventCount = checkIns.length
    hostCount = checkIns
      .filter(({ isHost }) => isHost)
      .length

    loading = false
  }
</script>

<Page
  loading={loading}
  location='participants'
  notFound={notFound}
  title={title}>
  <h1>{title}</h1>
  <p>{fullName}</p>
  <p>{eventCount} {pluralize(eventCount, 'event')}, {hostCount} {pluralize(hostCount, 'host')}</p>
  <ul class="list-inline">
    <li><a href={`?p=edit-participant&id=${participantId}`}>Edit</a></li>
  </ul>
  <h2>{eventCount ? 'Events' : 'No events'}</h2>
  <ul>
    {#each checkIns as checkIn}
      <li>
        <a href={checkIn.url}>{checkIn.name}</a>
        ({checkIn.displayDate})
        {#if checkIn.isHost}
          Host
        {/if}
      </li>
    {/each}
  </ul>
</Page>
