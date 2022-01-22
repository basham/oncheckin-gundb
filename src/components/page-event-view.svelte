<script>
  import { onMount } from 'svelte'
  import { checkInStore, eventStore } from '../stores.js'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const page = params.get('p')
  const eventId = params.get('id')

  let title = ''
  let loading = true
  let notFound = false
  let event = null
  let checkIns = []
  let anniversaries = []
  let visitors = []
  let virgins = []

  const heading = {
    all: 'Check-ins',
    anniversaries: 'Anniversaries',
    visitors: 'Visitors',
    virgins: 'Virgins'
  }
  const defaultHeading = heading.all

  onMount(async () => {
    event = await eventStore.get(eventId)
    title = `${event?.name} (${event?.displayDate})`
    notFound = !event
    checkIns = (await checkInStore.getEventCheckInsWithStats(eventId))
    anniversaries = checkIns
      .filter(({ checkInCount, host, specialCheckInCount, specialHostCount }) =>
        checkInCount > 0 && (specialCheckInCount || (host && specialHostCount))
      )
    virgins = checkIns
      .filter(({ checkInCount }) => checkInCount === 0)
    loading = false
  })
</script>

<style>
  .sub-nav {
    border-radius: var(--size-1);
    gap: var(--size-4);
    margin: 0 !important;
  }

  .sub-nav a {
    color: var(--color-base-50);
    display: inline-block;
    font-size: var(--fs-1);
    line-height: var(--lh-1);
    font-weight: bold;
    padding: var(--size-4) 0;
    text-decoration: none;
  }

  .sub-nav a:hover {
    color: var(--color-ix);
  }

  .sub-nav a[aria-current] {
    box-shadow: inset 0 calc(-1 * var(--px-2)) 0 0 var(--color-ix);
    color: var(--color-ix);
  }
</style>

<Page
  loading={loading}
  location='events'
  notFound={notFound}
  title={title}>
  <div class="layout-header u-p-top-6 u-p-bottom-4">
    <div class="layout-content">
      <h1>{event?.name}</h1>
      <p class="u-m-bottom-0">{event?.displayDateLong}</p>
    </div>
  </div>
  <div class="layout-header u-m-top-2px">
    <div class="layout-content u-p-top-0 u-p-bottom-0">
      <ul class="sub-nav list-inline">
        <li><a href={event.url} aria-current={page === 'event' ? 'page' : null}>Check-ins</a></li>
        <li><a href={`?p=event-circle&id=${event.id}`} aria-current={page === 'event-circle' ? 'page' : null}>Circle</a></li>
        <li><a href={`?p=roster&id=${eventId}`}>Print</a></li>
        <li><a href={`?p=edit-event&id=${eventId}`}>Edit</a></li>
      </ul>
    </div>
  </div>
  {#if page === 'event'}
    <div class="layout-content u-p-bottom-6">
      <h2 class="u-m-all-0">{`Check-ins (${checkIns.length})`}</h2>
      <div>
        <a class="button button--primary" href={`?p=new-check-in&id=${eventId}`}>New check-in</a>
      </div>
      <ul class="link-list u-m-top-6">
        {#each checkIns as checkIn}
          <li>
            <a class="link-row" href={checkIn.url}>
              <span class="link-row__primary">{checkIn.participant.displayName}</span>
              <span class="link-row__secondary">
                {#if checkIn.host}
                  <span>{`Hare #${checkIn.hostCount}`}</span>
                  <span>&middot;</span>
                {/if}
                <span>{`Run #${checkIn.checkInCount}`}</span>
              </span>
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
  {#if page === 'event-circle'}
    <div class="layout-content u-p-bottom-6">
      <h2 class="u-m-all-0">{`Anniversaries (${anniversaries.length})`}</h2>
      {#if anniversaries.length}
        <ul class="link-list u-m-top-6">
          {#each anniversaries as checkIn}
            <li>
              <a class="link-row" href={checkIn.url}>
                <span class="link-row__primary">{checkIn.participant.displayName}</span>
                <span class="link-row__secondary">
                  {#if checkIn.host}
                    <span>{`Hare #${checkIn.hostCount}`}</span>
                    <span>&middot;</span>
                  {/if}
                  <span>{`Run #${checkIn.checkInCount}`}</span>
                </span>
              </a>
            </li>
          {/each}
        </ul>
      {/if}
      <h2 class="u-m-all-0">{`Visitors (${visitors.length})`}</h2>
      {#if visitors.length}
        <ul class="link-list u-m-top-6">
          {#each visitors as checkIn}
            <li>
              <a class="link-row" href={checkIn.url}>
                <span class="link-row__primary">{checkIn.participant.displayName}</span>
                <span class="link-row__secondary">
                  {#if checkIn.host}
                    <span>{`Hare #${checkIn.hostCount}`}</span>
                    <span>&middot;</span>
                  {/if}
                  <span>{`Run #${checkIn.checkInCount}`}</span>
                </span>
              </a>
            </li>
          {/each}
        </ul>
      {/if}
      <h2 class="u-m-all-0">{`Virgins (${virgins.length})`}</h2>
      {#if virgins.length}
        <ul class="link-list u-m-top-6">
          {#each virgins as checkIn}
            <li>
              <a class="link-row" href={checkIn.url}>
                <span class="link-row__primary">{checkIn.participant.displayName}</span>
                <span class="link-row__secondary">
                  {#if checkIn.host}
                    <span>{`Hare #${checkIn.hostCount}`}</span>
                    <span>&middot;</span>
                  {/if}
                  <span>{`Run #${checkIn.checkInCount}`}</span>
                </span>
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</Page>
