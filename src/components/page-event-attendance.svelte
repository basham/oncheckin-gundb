<script>
  import { attendanceStore, eventStore, orgStore, participantStore } from '../stores.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Lookup from './lookup.svelte'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const eventId = params.get('id')
  const title = 'Edit attendance'

  let loading = true
  let notFound = false
  let eventName = ''
  let orgName = ''
  let participants = []

  load()

  async function load () {
    orgName = orgStore.get()?.name

    const event = eventStore.get(eventId)
    eventName = event?.name
    notFound = !event

    participants = participantStore.getAll()

    loading = false
  }

  function filterResult (query, participant) {
    return participant.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1
  }

  async function addParticipant (participant) {
    await attendanceStore.addAttendee(eventId, participant.id)
    window.location = `./?p=event&id=${eventId}`
  }
</script>

<Page
  loading={loading}
  notFound={notFound}
  title={title}>
  <Breadcrumbs>
    <BreadcrumbsItem>{orgName}</BreadcrumbsItem>
    <BreadcrumbsItem href="?p=events">Events</BreadcrumbsItem>
    <BreadcrumbsItem href={`?p=event&id=${eventId}`}>{eventName}</BreadcrumbsItem>
    <BreadcrumbsItem isCurrent={true}>{title}</BreadcrumbsItem>
  </Breadcrumbs>
  <h1>{title}</h1>
  <Lookup
    filter={filterResult}
    label="Add participant"
    onSelected={addParticipant}
    options={participants}
    render={({ fullName }) => fullName} />
</Page>
