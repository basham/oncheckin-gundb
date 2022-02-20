<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { eventStore } from '@src/stores.js'
  import Layout from '@src/layouts/events.[id].svelte'
  import FieldsetEvent from '@src/lib/fieldset-event.svelte'

  const params = getContext('params')
  const title = 'Edit event'

  let state = STATE.LOADING
  let event
  let name = ''
  let date = (new Date()).toJSON().split('T')[0]

  onMount(async () => {
    event = await eventStore.get(params.id)
    name = event?.name
    date = event?.date
    state = STATE.LOADED
  })

  async function submit (ev) {
    ev.preventDefault()
    await eventStore.set(event.id, { name, date })
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
        bind:date={date} />
    </div>
    <div class="u-m-top-4">
      <button class="button button--primary" type="submit">Save</button>
    </div>
  </form>
</Layout>
