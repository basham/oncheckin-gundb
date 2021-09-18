<script>
  import { participantStore, orgStore, attendanceStore } from '../stores.js'
  import { pluralize } from '../util.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const participantId = params.get('id')

  let title = ''
  let loading = true
  let notFound = false
  let orgName = ''
  let events = []
  let eventCount = 0
  let hostCount = 0

  load()

  async function load () {
    orgName = orgStore.get()?.name

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
  <Breadcrumbs>
    <BreadcrumbsItem>{orgName}</BreadcrumbsItem>
    <BreadcrumbsItem href="?p=participants">Participants</BreadcrumbsItem>
    <BreadcrumbsItem isCurrent={true}>{title}</BreadcrumbsItem>
  </Breadcrumbs>
  <h1>
    {#if title}
      {title}
    {:else}
      <em>Participant</em>
    {/if}
  </h1>
  <p>{eventCount} {pluralize(eventCount, 'event')}, {hostCount} {pluralize(hostCount, 'host')}</p>
  <p><a href={`?p=edit-participant&id=${participantId}`}>Edit</a></p>
  <h2>{events.length ? 'Events' : 'No events'}</h2>
  <ul>
    {#each events as event}
      <li>
        <a href={`?p=event&id=${event.id}`}>{event.name}</a>
        {event.displayDate}
        {#if event.isHost}
          Host
        {/if}
      </li>
    {/each}
  </ul>
</Page>
