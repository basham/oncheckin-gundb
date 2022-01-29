<script>
  import { onMount } from 'svelte'
  import { participantStore } from '../stores.js'
  import Participants from './participants.svelte'
  import Page from './page.svelte'

  const title = 'Hashers'

  let loading = true
  let participants = []

  onMount(async () => {
    participants = await participantStore.getAll()
    loading = false
  })
</script>

<Page
  loading={loading}
  location='participants'
  title={title}>
  <div class="card u-flex u-flex-space">
    <h1>{title}</h1>
    <a class="button button--primary button--small" href="?p=new-participant">New hasher</a>
  </div>
  <div class="card u-m-top-6">
    <h2>{`All hashers (${participants.length})`}</h2>
    <Participants participants={participants} />
  </div>
</Page>
