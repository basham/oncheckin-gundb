<script>
  import { get, getAll } from '../store.js'
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

  load()

  async function load () {
    const org = await get('org')
    orgName = org.data?.name

    const event = await get(['events', eventId], 'Event')
    if (event.data) {
      title = event.data.name
      date = event.data.displayDate
    } else {
      title = 'Event not found'
    }

    attendances = await getAll(['events', eventId, 'attendances'], 'Attendance')

    loading = false
  }
</script>

<Page
  loading={loading}
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
