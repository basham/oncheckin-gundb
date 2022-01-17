<script>
  import { onMount } from 'svelte'
  import { checkInStore, eventStore } from '../stores.js'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const eventId = params.get('id')

  let title = ''
  let loading = true
  let notFound = false
  let event = null
  let checkIns = []

  onMount(async () => {
    event = await eventStore.get(eventId)
    title = `${event?.name} (${event?.displayDate})`
    notFound = !event
    checkIns = await checkInStore.getEventCheckIns(eventId)
    loading = false
  })
</script>

<style>
  .checkIns {
    display: flex;
    flex-direction: column;
    gap: var(--size-2);
    margin: 0 0 0 var(--size-4);
  }
</style>

<Page
  loading={loading}
  location='events'
  notFound={notFound}
  title={title}>
  <h1>{event?.name}</h1>
  <p>{event?.displayDateLong}</p>
  <ul class="list-inline">
    <li><a href={`?p=new-check-in&id=${eventId}`}>New check-in</a></li>
    <li><a href={`?p=roster&id=${eventId}`}>Print roster</a></li>
    <li><a href={`?p=edit-event&id=${eventId}`}>Edit event</a></li>
  </ul>
  <h2>{checkIns.length ? `Check-ins (${checkIns.length})` : 'No check-ins'}</h2>
  <ul class="checkIns u-p-0">
    {#each checkIns as checkIn}
      <li>
        <a href={checkIn.url}>{checkIn.participant.displayName}</a>
        {#if checkIn.host}
          (host)
        {/if}
      </li>
    {/each}
  </ul>
</Page>
