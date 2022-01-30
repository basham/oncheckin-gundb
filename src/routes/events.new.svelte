<script>
  import { eventStore } from '@src/stores.js'
  import Layout from '@src/layouts/workspace.svelte'
  import FieldsetEvent from '@src/lib/fieldset-event.svelte'

  export let params
  export let route

  const title = 'New event'

  let name = ''
  let date = (new Date()).toJSON().split('T')[0]

  async function submit (e) {
    e.preventDefault()
    const event = await eventStore.create({ name, date })
    window.location = event.url
  }
</script>

<Layout
  location='events'
  title={title}>
  <div class="card">
    <h1>{title}</h1>
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
