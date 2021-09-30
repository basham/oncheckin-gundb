<script>
  import { participantStore } from '../stores.js'
  import FieldsetParticipantName from './fieldset-participant-name.svelte'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const participantId = params.get('id')

  let loading = true
  let notFound = false
  let title = ''
  let alias = ''
  let firstName = ''
  let lastName = ''
  let fullName = ''
  let url = ''

  load()

  async function load () {
    const participant = participantStore.get(participantId)
    alias = participant?.alias
    firstName = participant?.firstName
    lastName = participant?.lastName
    fullName = participant?.fullName
    title = `Edit: ${participant?.displayName}`
    url = participant?.url
    notFound = !participant

    loading = false
  }

  async function submit (event) {
    event.preventDefault()
    await participantStore.set(participantId, { alias, firstName, lastName })
    window.location = url
  }
</script>

<Page
  loading={loading}
  location='participants'
  notFound={notFound}
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
      <button type="submit">Save</button>
    </div>
    <p><a href={url}>Back</a></p>
  </form>
</Page>
