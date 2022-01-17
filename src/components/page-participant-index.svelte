<script>
  import { onMount } from 'svelte'
  import { participantStore } from '../stores.js'
  import Participants from './participants.svelte'
  import Page from './page.svelte'

  const title = 'Participants'

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
  <h1>{title}</h1>
  <ul class="list-inline">
    <li><a href="?p=new-participant">New participant</a></li>
  </ul>
  <h2>{`All participants (${participants.length})`}</h2>
  <Participants participants={participants} />
</Page>
