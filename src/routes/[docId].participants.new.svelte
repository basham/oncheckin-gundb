<script>
  import { participantStore } from '@src/stores.js'
  import Layout from '@src/layouts/workspace.svelte'
  import FieldsetParticipantName from '@src/lib/fieldset-participant-name.svelte'

  const title = 'New hasher'

  let fullName = ''
  let alias = ''

  async function submit (event) {
    event.preventDefault()
    const participant = await participantStore.create({ alias, fullName })
    window.location = participant.url
  }
</script>

<Layout title={title}>
  <h1>{title}</h1>
  <form
    autocomplete="off"
    on:submit={submit}>
    <FieldsetParticipantName
      bind:fullName={fullName}
      bind:alias={alias} />
    <div class="u-m-top-4">
      <button class="button button--primary" type="submit">Save</button>
    </div>
  </form>
</Layout>
