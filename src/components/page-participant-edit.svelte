<script>
  import { format, parseISO } from 'date-fns'
  import { participantStore } from '../stores.js'
  import Fieldset from './fieldset.svelte'
  import FieldsetParticipantName from './fieldset-participant-name.svelte'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const participantId = params.get('id')

  let loading = true
  let notFound = false
  let title = ''
  let participant = null
  let alias = ''
  let firstName = ''
  let lastName = ''
  let location = ''
  let notes = ''
  let recordedLastCheckInDate = ''
  $: recordedLastCheckInDateLabel = recordedLastCheckInDate ? format(parseISO(recordedLastCheckInDate), 'PP') : 'last check-in date'
  let recordedCheckInsCount = 0
  let recordedHostCount = 0

  load()

  async function load () {
    participant = participantStore.get(participantId)
    notFound = !participant
    title = `Edit: ${participant?.displayName}`
    alias = participant?.alias
    firstName = participant?.firstName
    lastName = participant?.lastName
    location = participant?.location
    notes = participant?.notes
    recordedLastCheckInDate = participant?.recordedLastCheckInDate
    recordedCheckInsCount = participant?.recordedCheckInsCount
    recordedHostCount = participant?.recordedHostCount
    loading = false
  }

  async function submit (event) {
    event.preventDefault()
    await participantStore.set(participantId, {
      alias,
      firstName,
      lastName,
      location,
      notes,
      recordedLastCheckInDate,
      recordedCheckInsCount,
      recordedHostCount
    })
    window.location = participant?.url
  }
</script>

<Page
  loading={loading}
  location='participants'
  notFound={notFound}
  title={title}>
  <h1>{title}</h1>
  <form
    autocomplete="off"
    on:submit={submit}>
    <Fieldset legend="Profile">
      <FieldsetParticipantName
        bind:firstName={firstName}
        bind:lastName={lastName}
        bind:alias={alias} />
      <div class="u-m-top-6">
        <label for="locationInput">Location</label>
        <br>
        <input
          bind:value={location}
          class="input"
          id="locationInput"
          type="text">
      </div>
      <div class="u-m-top-6">
        <label for="notesInput">Notes</label>
        <br>
        <textarea
          bind:value={notes}
          class="input"
          id="notesInput"
          rows="5" />
      </div>
    </Fieldset>
    <Fieldset legend="Historical records">
      <div class="u-m-top-6">
        <label for="recordedLastCheckInDate">Last check-in date</label>
        <br>
        <input
          bind:value={recordedLastCheckInDate}
          class="input"
          id="recordedLastCheckInDate"
          type="date">
      </div>
      <div class="u-m-top-6">
        <label for="recordedCheckInsCountInput">
          {`Check-ins as of ${recordedLastCheckInDateLabel}`}
        </label>
        <br>
        <input
          bind:value={recordedCheckInsCount}
          class="input"
          id="recordedCheckInsCountInput"
          min="0"
          type="number">
      </div>
      <div class="u-m-top-6">
        <label for="recordedHostCountInput">
          {`Hares as of ${recordedLastCheckInDateLabel}`}
        </label>
        <br>
        <input
          bind:value={recordedHostCount}
          class="input"
          id="recordedHostCountInput"
          min="0"
          type="number">
      </div>
    </Fieldset>
    <div class="u-m-top-6">
      <button class="button button--primary" type="submit">Save</button>
    </div>
    <p><a href={participant?.url}>Back</a></p>
  </form>
</Page>
