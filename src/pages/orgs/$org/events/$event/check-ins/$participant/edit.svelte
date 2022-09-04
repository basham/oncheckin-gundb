<script>
  import { getContext } from 'svelte'
  import FieldsetCheckIn from '@src/lib/fieldset-check-in.svelte'
  import Layout from '@src/pages/orgs/$org/events/$event/layout.svelte'

  const { h2, event, participant, checkIn } = getContext('data')
  const { host } = checkIn
  /*
  let event = null
  let participant = null
  let checkIn = null
  let host = false

  onMount(async () => {
    event = await eventStore.get(docId, eventId)
    participant = await participantStore.get(docId, participantId)
    checkIn = await checkInStore.get(docId, eventId, participantId)
    if (!event || !participant || !checkIn) {
      state = STATE.NOT_FOUND
      return
    }
    host = checkIn?.host
    state = STATE.LOADED
  })

  async function submit (e) {
    e.preventDefault()
    await checkInStore.set(docId, eventId, participantId, { host })
    window.location = event.url
  }
  */
  async function deleteCheckIn () {
    // await checkInStore.delete(docId, eventId, participantId)
    // window.location = event.url
  }
</script>

<Layout>
  <h2>{h2}</h2>
  <p aria-label="Participant" class="card u-m-top-4" role="group">
    <a class="u-ts-3" href={participant.url}>{participant.displayName}</a>
    <br>
    {participant.fullName}
  </p>
  <form
    autocomplete="off"
    method="post">
    <FieldsetCheckIn host={host} />
    <div class="u-m-top-6">
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
