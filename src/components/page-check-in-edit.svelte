<script>
  import { attendanceStore, eventStore, participantStore } from '../stores.js'
  import FieldsetCheckIn from './fieldset-check-in.svelte'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const eventId = params.get('event-id')
  const participantId = params.get('participant-id')

  const title = 'Edit check-in'
  let pageTitle = ''
  let loading = true
  let notFound = false
  let event = null
  let participant = null
  let checkIn = null

  load()

  async function load () {
    event = eventStore.get(eventId)
    participant = participantStore.get(participantId)
    checkIn = attendanceStore.get(eventId, participantId)
    pageTitle = `${title} for ${participant?.displayName} at ${event?.name} (${event?.date})`
    notFound = !event || !participant || !checkIn
    loading = false
  }

  function submit (event) {
    event.preventDefault()
  }
</script>

<Page
  loading={loading}
  location='events'
  notFound={notFound}
  title={pageTitle}>
  <h1>{title}</h1>
  <p
    aria-label="Event"
    role="group">
    <a class="u-ts-3" href={event?.url}>{event?.name}</a>
    <br>
    {event?.displayDate}
  </p>
  <p
    aria-label="Participant"
    role="group">
    <a class="u-ts-3" href={participant?.url}>{participant?.displayName}</a>
    <br>
    {participant?.fullName}
  </p>
  <form
    autocomplete="off"
    on:submit={submit}>
    <FieldsetCheckIn />
    <div class="u-m-top-4">
      <button type="submit">Save</button>
    </div>
    <div class="u-m-top-4">
      <button type="button" class="button--secondary">Delete</button>
    </div>
    <p><a href={event?.url}>Back</a></p>
  </form>
</Page>
