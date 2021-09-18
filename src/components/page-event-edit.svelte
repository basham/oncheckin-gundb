<script>
  import { eventStore } from '../stores.js'
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
    <div class="u-m-top-4">
      <label for="nameInput">Name</label>
      <input
        bind:value={name}
        id="nameInput"
        type="text">
    </div>
    <div class="u-m-top-4">
      <label for="dateInput">Date</label>
      <input
        bind:value={date}
        id="dateInput"
        type="date">
    </div>
    <div class="u-m-top-4">
      <button type="submit">Save</button>
    </div>
    <p><a href={eventUrl}>Back</a></p>
  </form>
</Page>
