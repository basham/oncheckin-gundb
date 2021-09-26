<script>
  import { eventStore } from '../stores.js'
  import Page from './page.svelte'

  const title = 'New event'

  let name = ''
  let date = (new Date()).toJSON().split('T')[0]

  async function submit (ev) {
    ev.preventDefault()
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
    <div class="u-m-top-6">
      <label for="nameInput">Name</label>
      <br>
      <input
        bind:value={name}
        id="nameInput"
        type="text">
    </div>
    <div class="u-m-top-6">
      <label for="dateInput">Date</label>
      <br>
      <input
        bind:value={date}
        id="dateInput"
        type="date">
    </div>
    <div class="u-m-top-6">
      <button type="submit">Save</button>
    </div>
  </form>
</Page>
