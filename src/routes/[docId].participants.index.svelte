<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { participantStore } from '@src/stores.js'
  import Layout from '@src/layouts/workspace.svelte'
  import Participants from '@src/lib/participants.svelte'

  const title = 'Hashers'
  const { docId } = getContext('params')

  let state = STATE.LOADING
  let participants = []

  onMount(async () => {
    participants = await participantStore.getAll(docId)
    state = STATE.LOADED
  })
</script>

<Layout
  state={state}
  title={title}>
  <div class="u-flex u-flex-end u-flex-space">
    <h1>{title}</h1>
    <div>
      <a class="button button--primary" href="?p=participants/new">New hasher</a>
    </div>
  </div>
  <h2>All hashers <span class="badge">{participants.length}</span></h2>
  <Participants participants={participants} />
</Layout>
