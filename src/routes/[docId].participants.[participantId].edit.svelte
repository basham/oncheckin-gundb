<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { participantStore } from '@src/stores.js'
  import Layout from '@src/layouts/participants.[id].svelte'
  import Fieldset from '@src/lib/fieldset.svelte'
  import FieldsetParticipantName from '@src/lib/fieldset-participant-name.svelte'

  const { docId, participantId } = getContext('params')

  let state = STATE.LOADING
  let participant = null
  let alias = ''
  let fullName = ''
  let location = ''
  let notes = ''

  onMount(async () => {
    participant = await participantStore.get(docId, participantId)
    alias = participant?.alias
    fullName = participant?.fullName
    location = participant?.location
    notes = participant?.notes
    state = STATE.LOADED
  })

  async function submit (event) {
    event.preventDefault()
    await participantStore.set(docId, participantId, {
      alias,
      fullName,
      location,
      notes
    })
    window.location = participant?.url
  }
</script>

<Layout
  state={state}
  title="Edit">
  <h2>Edit hasher</h2>
  <form
    autocomplete="off"
    on:submit={submit}>
    <Fieldset legend="Name">
      <FieldsetParticipantName
        bind:alias={alias}
        bind:fullName={fullName} />
    </Fieldset>
    <Fieldset legend="Details">
      <div class="u-m-top-4">
        <label for="locationInput">Location</label>
        <br>
        <input
          bind:value={location}
          class="input"
          id="locationInput"
          type="text">
      </div>
      <div class="u-m-top-4">
        <label for="notesInput">Notes</label>
        <br>
        <textarea
          bind:value={notes}
          class="input"
          id="notesInput"
          rows="5" />
      </div>
    </Fieldset>
    <div class="u-m-top-4">
      <button class="button button--primary" type="submit">Save</button>
    </div>
    <p class="u-m-top-4"><a href={participant?.url}>Back</a></p>
  </form>
</Layout>
