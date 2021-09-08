<script>
  import { map, store } from '../store.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const eventId = params.get('id')

  let title = ''
  let loading = true
  let orgName = ''
  let date = ''
  let _attendances = []

  load()

  async function load () {
    const org = await store.get('org')
    orgName = org?.name

    const eventRef = store.get('events').get(eventId)
    const event = await eventRef
    if (event) {
      title = event.name
      date = event.date
    } else {
      title = 'Event not found'
    }

    const attendances = await map(eventRef.get('attendances'))
    const attendancesRich = attendances.map(async (attendance) => {
      const participant = await store.get(attendance.participant)
      return { ...attendance, participant }
    })
    const att = await Promise.all(attendancesRich)
    _attendances = att

    console.log('##', att)

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
    {#each _attendances as attendance}
      <li>{attendance.participant.firstName} {attendance.participant.lastName}</li>
    {/each}
  </ul>
</Page>
