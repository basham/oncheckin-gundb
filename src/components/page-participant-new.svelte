<script>
  import { participantStore } from '../stores.js'
  import Page from './page.svelte'

  const title = 'New participant'

  let firstName = ''
  let lastName = ''

  async function submit (event) {
    event.preventDefault()
    const participant = await participantStore.create({ firstName, lastName })
    window.location = participant.url
  }
</script>

<Page
  location='participants'
  title={title}>
  <h1>{title}</h1>
  <form
    autocomplete="off"
    on:submit={submit}>
    <div class="u-m-top-4">
      <label for="firstNameInput">First name</label>
      <input
        bind:value={firstName}
        id="firstNameInput"
        type="text">
    </div>
    <div class="u-m-top-4">
      <label for="lastNameInput">Last name</label>
      <input
        bind:value={lastName}
        id="lastNameInput"
        type="text">
    </div>
    <div class="u-m-top-4">
      <button type="submit">Save</button>
    </div>
  </form>
</Page>
