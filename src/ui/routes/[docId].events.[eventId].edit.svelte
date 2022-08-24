<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { eventStore } from '@src/ui/stores.js'
  import Layout from '@src/ui/layouts/events.[id].svelte'
  import FieldsetEvent from '@src/ui/lib/fieldset-event.svelte'

  const { docId, eventId } = getContext('params')
  const title = 'Edit event'

  let state = STATE.LOADING
  let event
  let name = ''
  let date = (new Date()).toJSON().split('T')[0]
  let count = ''

  onMount(async () => {
    event = await eventStore.get(docId, eventId)
    name = event?.name
    date = event?.date
    count = event?.count
    state = STATE.LOADED
  })

  async function submit (ev) {
    ev.preventDefault()
    await eventStore.set(docId, eventId, { name, date, count })
    window.location = event.url
  }
</script>

<Layout
  state={state}
  title={title}>
  <h2>{title}</h2>
  <form
    autocomplete="off"
    on:submit={submit}>
    <div class="u-m-top-4">
      <FieldsetEvent
        bind:name={name}
        bind:date={date}
        bind:count={count} />
    </div>
    <div class="u-m-top-4">
      <button class="button button--primary" type="submit">Save</button>
    </div>
  </form>
</Layout>
