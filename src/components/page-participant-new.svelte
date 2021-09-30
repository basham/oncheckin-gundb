<script>
  import { participantStore } from '../stores.js'
  import FieldsetParticipantName from './fieldset-participant-name.svelte'
  import Page from './page.svelte'

  const title = 'New participant'

  let firstName = ''
  let lastName = ''
  let alias = ''

  async function submit (event) {
    event.preventDefault()
    const participant = await participantStore.create({ alias, firstName, lastName })
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
    <FieldsetParticipantName
      bind:firstName={firstName}
      bind:lastName={lastName}
      bind:alias={alias} />
    <div class="u-m-top-6">
      <button class="button button--primary" type="submit">Save</button>
    </div>
  </form>
</Page>
