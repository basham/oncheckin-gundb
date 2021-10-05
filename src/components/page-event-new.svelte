<script>
  import { eventStore } from '../stores.js'
  import FieldsetEvent from './fieldset-event.svelte'
  import Page from './page.svelte'

  const title = 'New event'

  let name = ''
  let date = (new Date()).toJSON().split('T')[0]

  async function submit (e) {
    e.preventDefault()
    const event = await eventStore.create({ name, date })
    window.location = event.url
  }
</script>

<Page
  location='events'
  title={title}>
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
</Page>
