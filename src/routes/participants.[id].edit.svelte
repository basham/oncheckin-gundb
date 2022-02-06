<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { participantStore } from '@src/stores.js'
  import Layout from '@src/layouts/participants.[id].svelte'
  import Fieldset from '@src/lib/fieldset.svelte'
  import FieldsetParticipantName from '@src/lib/fieldset-participant-name.svelte'

  const params = getContext('params')

  let state = STATE.LOADING
  let participant = null
  let alias = ''
  let firstName = ''
  let lastName = ''
  let location = ''
  let notes = ''

  onMount(async () => {
    participant = await participantStore.get(params.id)
    alias = participant?.alias
    firstName = participant?.firstName
    lastName = participant?.lastName
    location = participant?.location
    notes = participant?.notes
    state = STATE.LOADED
  })

  async function submit (event) {
    event.preventDefault()
    await participantStore.set(params.id, {
      alias,
      firstName,
      lastName,
      location,
      notes
    })
    window.location = participant?.url
  }
</script>

<Layout
  state={state}
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
    <div class="u-m-top-6">
      <button class="button button--primary" type="submit">Save</button>
    </div>
    <p class="u-m-top-6"><a href={participant?.url}>Back</a></p>
  </form>
</Layout>
