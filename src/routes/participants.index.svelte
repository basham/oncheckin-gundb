<script>
  import { onMount } from 'svelte'
  import { participantStore } from '@src/stores.js'
  import Layout from '@src/layouts/workspace.svelte'
  import Participants from '@src/lib/participants.svelte'

  export let params
  export let route

  const title = 'Hashers'

  let loaded = false
  let participants = []

  onMount(async () => {
    participants = await participantStore.getAll()
    loaded = true
  })
</script>

<Layout
  loaded={loaded}
  location='participants'
  title={title}>
  <div class="card u-flex u-flex-space">
    <h1>{title}</h1>
    <a class="button button--primary button--small" href="?p=participants/new">New hasher</a>
  </div>
  <div class="card u-m-top-6">
    <h2>{`All hashers (${participants.length})`}</h2>
    <Participants participants={participants} />
  </div>
</Layout>
