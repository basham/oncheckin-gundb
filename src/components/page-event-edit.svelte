<script>
  import { eventStore } from '../stores.js'
  import FieldsetEvent from './fieldset-event.svelte'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const eventId = params.get('id')

  let loading = true
  let notFound = false
  let title = ''
  let eventName = ''
  let eventDate = ''
  let eventUrl = ''
  let name = ''
  let date = (new Date()).toJSON().split('T')[0]

  load()

  async function load () {
    const event = eventStore.get(eventId)
    name = event?.name
    date = event?.date
    eventName = name
    eventDate = event?.displayDate
    eventUrl = event?.url
    title = `Edit: ${name}`
    notFound = !event
    loading = false
  }

  async function submit (event) {
    event.preventDefault()
    await eventStore.set(eventId, { name, date })
    window.location = eventUrl
  }
</script>

<Page
  loading={loading}
  location='events'
  notFound={notFound}
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
    <p><a href={eventUrl}>Back</a></p>
  </form>
</Page>
