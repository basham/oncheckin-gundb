<script>
  import { attendanceStore, eventStore, participantStore } from '../stores.js'
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
  let eventDate = ''
  let eventUrl = ''
  let attendees = []
  let participants = []

  load()

  async function load () {
    const event = eventStore.get(eventId)
    eventName = event?.name
    eventDate = event?.displayDate
    eventUrl = event?.url
    notFound = !event

    attendees = attendanceStore.getAttendees(eventId)
      .map((p) => {
        const nameId = `${p.id}-name`
        return { ...p, nameId }
      })

    const attendeeIds = attendees
      .map((p) => p.id)
      .join('-')

    participants = participantStore.getAll()
      .filter((p) => !attendeeIds.includes(p.id))

    loading = false
  }

  function filterResult (query, participant) {
    return participant.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1
  }

  async function addParticipant (participant) {
    await attendanceStore.addAttendee(eventId, participant.id)
    await load()
  }

  async function makeAttendee (event) {
    const { id } = event.target.dataset
    await attendanceStore.addAttendee(eventId, id)
    await load()
  }

  async function makeHost (event) {
    const { id } = event.target.dataset
    await attendanceStore.addHost(eventId, id)
    await load()
  }

  async function removeAttendee (event) {
    const { id } = event.target.dataset
    await attendanceStore.removeAttendee(eventId, id)
    await load()
  }
</script>

<style>
  .attendee {
    text-transform: capitalize;
  }
</style>

<Page
  loading={loading}
  location='events'
  notFound={notFound}
  title={[title, `${eventName} (${eventDate})`]}>
  <Breadcrumbs>
    <BreadcrumbsItem href={eventUrl}>{eventName} ({eventDate})</BreadcrumbsItem>
    <BreadcrumbsItem isCurrent={true}>{title}</BreadcrumbsItem>
  </Breadcrumbs>
  <h1>{title}</h1>
  <Lookup
    filter={filterResult}
    label="Add participant"
    onSelected={addParticipant}
    options={participants}
    render={({ fullName }) => fullName} />
  <h2>Participants</h2>
  <ul>
    {#each attendees as attendee}
      <li>
        <a
          href={attendee.url}
          id={attendee.nameId}>
          {attendee.fullName}
        </a>
        <span class="attendee">{attendee.attendee}</span>
        {#if attendee.isHost}
          <button
            aria-describedby={attendee.nameId}
            data-id={attendee.id}
            on:click={makeAttendee}>
            Make attendee
          </button>
        {:else}
          <button
            aria-describedby={attendee.nameId}
            data-id={attendee.id}
            on:click={makeHost}>
            Make host
          </button>
        {/if}
        <button
          aria-describedby={attendee.nameId}
          data-id={attendee.id}
          on:click={removeAttendee}>
          Remove
        </button>
      </li>
    {/each}
  </ul>
</Page>
