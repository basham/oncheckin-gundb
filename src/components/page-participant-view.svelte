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
  let stats = null

  load()

  async function load () {
    const participant = participantStore.get(participantId)
    title = participant?.displayName
    notFound = !participant
    fullName = participant?.fullName

    checkIns = checkInStore.getParticipantCheckIns(participantId)
    stats = checkInStore.getParticipantStats(participantId)

    loading = false
  }
</script>

<style>
  .checkIns {
    display: flex;
    flex-direction: column;
    gap: var(--size-3);
    margin: 0 0 0 var(--size-4);
    padding: 0;
  }

  .date {
    display: inline-block;
    min-width: 12ch;
  }
</style>

<Page
  loading={loading}
  location='participants'
  notFound={notFound}
  title={title}>
  <h1>{title}</h1>
  <p>{fullName}</p>
  <p>{stats?.checkInCount} {pluralize(stats?.checkInCount, 'hash', 'hashes')}, {stats?.hostCount} {pluralize(stats?.hostCount, 'hare')}</p>
  <ul class="list-inline">
    <li><a href={`?p=edit-participant&id=${participantId}`}>Edit</a></li>
  </ul>
  <h2>{stats?.checkInCount ? 'Check-ins' : 'No check-ins'}</h2>
  <ul class="checkIns">
    {#each checkIns as checkIn}
      <li>
        <span class="date">{checkIn.event.displayDate}</span>
        <a href={checkIn.event.url}>{checkIn.event.name}</a>
        {#if checkIn.host}
          (hare)
        {/if}
      </li>
    {/each}
  </ul>
  {#if stats?.missingCheckInCount}
    <h2>Missing records</h2>
    <p>Records are missing for this participant:</p>
    <p>{`${stats?.missingCheckInCount} ${pluralize(stats?.missingCheckInCount, 'hash', 'hashes')} and ${stats?.missingHostCount} ${pluralize(stats?.missingHostCount, 'hare')}, as of ${stats?.recordedLastCheckInDateDisplay}.`}</p>
  {/if}
</Page>
