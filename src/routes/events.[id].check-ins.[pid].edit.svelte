<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { checkInStore, eventStore, participantStore } from '@src/stores.js'
  import Layout from '@src/layouts/events.[id].svelte'
  import FieldsetCheckIn from '@src/lib/fieldset-check-in.svelte'

  const params = getContext('params')

  let state = STATE.LOADING
  let title = ''
  let event = null
  let participant = null
  let checkIn = null
  let host = false

  onMount(async () => {
    event = await eventStore.get(params.id)
    participant = await participantStore.get(params.pid)
    checkIn = await checkInStore.get(event.id, participant.id)
    if (!event || !participant || !checkIn) {
      state = STATE.NOT_FOUND
      return
    }
    host = checkIn?.host
    title = `${title} for ${participant?.displayName}`
    state = STATE.LOADED
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

<Layout
  state={state}
  title={title}>
  <p aria-label="Participant" class="u-m-top-6" role="group">
    <a class="u-ts-3" href={participant.url}>{participant.displayName}</a>
    <br>
    {participant.fullName}
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
    <p class="u-m-top-6"><a href={event.url}>Back</a></p>
  </form>
</Layout>
