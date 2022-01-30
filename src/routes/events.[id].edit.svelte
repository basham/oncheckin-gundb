<script>
  import { onMount } from 'svelte'
  import { eventStore } from '@src/stores.js'
  import Layout from '@src/layouts/events.[id].svelte'
  import FieldsetEvent from '@src/lib/fieldset-event.svelte'

  export let params
  export let route

  let loaded = false
  let event
  let name = ''
  let date = (new Date()).toJSON().split('T')[0]

  onMount(async () => {
    event = await eventStore.get(params.id)
    name = event?.name
    date = event?.date
    loaded = true
  })

  async function submit (ev) {
    ev.preventDefault()
    await eventStore.set(event.id, { name, date })
    window.location = event.url
  }
</script>

<Layout
  loaded={loaded}
  params={params}
  route={route}
  title="Edit">
  <div class="card u-m-top-6">
    <h2>Edit event</h2>
    <form
      autocomplete="off"
      on:submit={submit}>
      <FieldsetEvent
        bind:name={name}
        bind:date={date} />
      <div class="u-m-top-6">
        <button class="button button--primary" type="submit">Save</button>
      </div>
    </form>
  </div>
</Layout>
