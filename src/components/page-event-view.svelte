<script>
  import { onMount } from 'svelte'
  import { checkInStore, eventStore } from '../stores.js'
  import CheckInList from './list-check-in.svelte'
  import NavLink from './nav-link.svelte'
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

  onMount(async () => {
    event = await eventStore.get(eventId)
    title = `${event?.name} (${event?.displayDate})`
    notFound = !event
    checkIns = (await checkInStore.getEventCheckInsWithStats(eventId))
    
    if (page === 'event-circle') {
      title = `Circle: ${title}`
      anniversaries = checkIns
        .filter(({ checkInCount, host, specialCheckInCount, specialHostCount }) =>
          checkInCount > 0 && (specialCheckInCount || (host && specialHostCount))
        )
      virgins = checkIns
        .filter(({ checkInCount }) => checkInCount === 0)
    }

    loading = false
  })
</script>

<Page
  loading={loading}
  location='events'
  notFound={notFound}
  title={title}>
  <h1>{event?.name}</h1>
  <p class="u-m-top-2">{event?.displayDateLong}</p>
  <nav class="list-inline u-m-top-4">
    <NavLink
      href={event.url}
      id="event"
      location={page}>
      Check-ins
    </NavLink>
    <NavLink
      href={`?p=event-circle&id=${event.id}`}
      id="event-circle"
      location={page}>
      Circle
    </NavLink>
    <NavLink href={`?p=roster&id=${eventId}`}>
      Print
    </NavLink>
    <NavLink
      href={`?p=edit-event&id=${eventId}`}
      id="edit-event"
      location={page}>
      Edit
    </NavLink>
  </nav>
  {#if page === 'event'}
    <h2>{`Check-ins (${checkIns.length})`}</h2>
    <div class="u-m-top-4">
      <a class="button button--primary" href={`?p=new-check-in&id=${eventId}`}>New check-in</a>
    </div>
    <CheckInList checkIns={checkIns} />
  {/if}
  {#if page === 'event-circle'}
    <h2 class="u-m-all-0">{`Anniversaries (${anniversaries.length})`}</h2>
    <CheckInList checkIns={anniversaries} />
    <h2 class="u-m-all-0">{`Visitors (${visitors.length})`}</h2>
    <CheckInList checkIns={visitors} />
    <h2 class="u-m-all-0">{`Virgins (${virgins.length})`}</h2>
    <CheckInList checkIns={virgins} />
  {/if}
</Page>
