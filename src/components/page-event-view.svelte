<script>
  // import { get, getAll } from '../store.js'
  import { get, getEvent } from '../earthstar.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const eventId = params.get('id')

  let title = ''
  let loading = true
  let orgName = ''
  let date = ''
  let attendances = []
  let notFound = false

  load()

  async function load () {
    orgName = get('org/name.txt')

    const event = getEvent(eventId)
    title = event?.name
    date = event?.displayDate
    notFound = !event

    // attendances = await getAll(['events', eventId, 'attendances'], 'Attendance')

    loading = false
  }
</script>

<Page
  loading={loading}
  notFound={notFound}
  title={title}>
  <Breadcrumbs>
    <BreadcrumbsItem>{orgName}</BreadcrumbsItem>
    <BreadcrumbsItem href="?p=events">Events</BreadcrumbsItem>
    <BreadcrumbsItem isCurrent={true}>{title}</BreadcrumbsItem>
  </Breadcrumbs>
  <h1>
    {#if title}
      {title}
    {:else}
      <em>Event</em>
    {/if}
  </h1>
  <p>{date}</p>
  <ul>
    <li><a href={`?p=edit-event&id=${eventId}`}>Edit event</a></li>
    <li><a href={`?p=edit-attendance&id=${eventId}`}>Edit attendance</a></li>
  </ul>
  <h2>Participants</h2>
  <ul>
    {#each attendances as attendance}
      <li><a href={`?p=participant&id=${attendance.data.participant.key}`}>{attendance.data.participant.data.fullName}</a></li>
    {/each}
  </ul>
</Page>
