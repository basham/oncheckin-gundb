<script>
  import { onMount } from 'svelte'
  import { checkInStore, participantStore } from '@src/stores.js'
  import { pluralize } from '@src/util.js'
  import Layout from '@src/layouts/participants.[id].svelte'

  export let params
  export let route

  let loaded = false
  let checkIns = []
  let stats = null
  let participant

  onMount(async () => {
    participant = await participantStore.get(params.id)
    checkIns = await checkInStore.getParticipantCheckIns(participant.id)
    stats = await checkInStore.getParticipantStats(participant.id)
    loaded = true
  })
</script>

<Layout
  loaded={loaded}
  params={params}
  route={route}>
  <div class="card u-m-top-6">
    <h2>{stats?.checkInCount ? 'Check-ins' : 'No check-ins'}</h2>
    <ul class="link-list u-m-top-4">
      {#each checkIns as checkIn}
        <li>
          <a class="link-row" href={checkIn.event.url}>
            <span class="link-row__primary">{checkIn.event.name}</span>
            <span class="link-row__secondary">{`${checkIn.event.displayDate}${checkIn.host ? ' (hare)' : ''}`}</span>
          </a>
        </li>
      {/each}
    </ul>
  </div>
  {#if stats?.missingCheckInCount}
    <div class="card u-m-top-6">
      <h2>Missing records</h2>
      <p class="u-m-top-2">Records are missing for this participant:</p>
      <p>{`${stats?.missingCheckInCount} ${pluralize(stats?.missingCheckInCount, 'hash', 'hashes')} and ${stats?.missingHostCount} ${pluralize(stats?.missingHostCount, 'hare')}, as of ${stats?.recordedLastCheckInDateDisplay}.`}</p>
    </div>
  {/if}
</Layout>
