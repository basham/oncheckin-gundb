<script>
  import { onMount } from 'svelte'
  import { checkInStore, eventStore } from '../stores.js'
  import Card from './card.svelte'
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
    <Card
      class="u-m-top-6"
      heading={`Check-ins (${checkIns.length})`}>
      <a
        class="button button--primary button--small"
        href={`?p=new-check-in&id=${eventId}`}
        slot="actions">
        New check-in
      </a>
      <CheckInList checkIns={checkIns} />
    </Card>
  {/if}
  {#if page === 'event-circle'}
    <Card
      class="u-m-top-6"
      heading={`Anniversaries (${anniversaries.length})`}>
      <CheckInList checkIns={anniversaries} />
    </Card>
    <Card
      class="u-m-top-4"
      heading={`Visitors (${visitors.length})`}>
      <CheckInList checkIns={visitors} />
    </Card>
    <Card
      class="u-m-top-4"
      heading={`Virgins (${virgins.length})`}>
      <CheckInList checkIns={virgins} />
    </Card>
  {/if}
</Page>
