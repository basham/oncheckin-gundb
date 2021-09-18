<script>
  import { attendanceStore, eventStore, orgStore } from '../stores.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const eventId = params.get('id')

  let title = ''
  let loading = true
  let notFound = false
  let orgName = ''
  let name = ''
  let date = ''
  let participants = []

  load()

  async function load () {
    orgName = orgStore.get()?.name

    const event = eventStore.get(eventId)
    name = event?.name
    date = event?.displayDate
    title = `${name} (${date})`
    notFound = !event

    participants = attendanceStore.getAttendees(eventId)

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
  <h1>{name}</h1>
  <p>{date}</p>
  <ul>
    <li><a href={`?p=edit-event&id=${eventId}`}>Edit event</a></li>
    <li><a href={`?p=edit-attendance&id=${eventId}`}>Edit attendance</a></li>
  </ul>
  <h2>{participants.length ? 'Participants' : 'No participants'}</h2>
  <ul>
    {#each participants as participant}
      <li>
        <a href={participant.url}>{participant.fullName}</a>
        {#if participant.isHost}
          Host
        {/if}
      </li>
    {/each}
  </ul>
</Page>
