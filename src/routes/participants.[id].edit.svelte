<script>
  import { format, parseISO } from 'date-fns'
  import { getContext, onMount } from 'svelte'
  import { participantStore } from '@src/stores.js'
  import Layout from '@src/layouts/participants.[id].svelte'
  import Fieldset from '@src/lib/fieldset.svelte'
  import FieldsetParticipantName from '@src/lib/fieldset-participant-name.svelte'

  const params = getContext('params')

  let loaded = false
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

  onMount(async () => {
    participant = await participantStore.get(params.id)
    alias = participant?.alias
    firstName = participant?.firstName
    lastName = participant?.lastName
    location = participant?.location
    notes = participant?.notes
    recordedLastCheckInDate = participant?.recordedLastCheckInDate
    recordedCheckInsCount = participant?.recordedCheckInsCount
    recordedHostCount = participant?.recordedHostCount
    loaded = true
  })

  async function submit (event) {
    event.preventDefault()
    await participantStore.set(params.id, {
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

<Layout
  loaded={loaded}
  title="Edit">
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
    <p class="u-m-top-6"><a href={participant?.url}>Back</a></p>
  </form>
</Layout>
