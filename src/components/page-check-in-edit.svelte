<script>
  import { onMount } from 'svelte'
  import { checkInStore, eventStore, participantStore } from '../stores.js'
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
  let host = false

  onMount(async () => {
    event = await eventStore.get(eventId)
    participant = await participantStore.get(participantId)
    checkIn = await checkInStore.get(eventId, participantId)
    host = checkIn?.host
    pageTitle = `${title} for ${participant?.displayName} at ${event?.name} (${event?.date})`
    notFound = !event || !participant || !checkIn
    loading = false
  })

  async function submit (e) {
    e.preventDefault()
    await checkInStore.set(event.id, participant.id, { host })
    window.location = event.url
  }

  async function deleteCheckIn () {
    await checkInStore.delete(event.id, participant.id)
    window.location = event.url
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
    <FieldsetCheckIn bind:host={host} />
    <div class="u-m-top-4">
      <button
        class="button button--primary"
        type="submit">
        Save
      </button>
    </div>
    <div class="u-m-top-4">
      <button
        class="button"
        on:click={deleteCheckIn}
        type="button">
        Delete
      </button>
    </div>
    <p><a href={event?.url}>Back</a></p>
  </form>
</Page>
