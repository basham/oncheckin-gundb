<script>
  import { participantStore } from '@src/stores.js'
  import Layout from '@src/layouts/workspace.svelte'
  import FieldsetParticipantName from '@src/lib/fieldset-participant-name.svelte'

  export let params
  export let route

  const title = 'New hasher'

  let firstName = ''
  let lastName = ''
  let alias = ''

  async function submit (event) {
    event.preventDefault()
    const participant = await participantStore.create({ alias, firstName, lastName })
    window.location = participant.url
  }
</script>

<Layout
  location='participants'
  title={title}>
  <div class="card">
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
  </div>
</Layout>
