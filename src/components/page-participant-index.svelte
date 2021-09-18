<script>
  import { participantStore } from '../stores.js'
  import Participants from './participants.svelte'
  import Page from './page.svelte'

  const title = 'Participants'

  let loading = true
  let participants = []

  load()

  async function load () {
    participants = participantStore.getAll()
    loading = false
  }
</script>

<style>
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-2) var(--size-4);
    list-style-type: '';
    margin: var(--size-2) 0;
    padding: 0;
  }
</style>

<Page
  loading={loading}
  title={title}>
  <h1>{title}</h1>
  <ul class="toolbar">
    <li><a href="?p=new-participant">New participant</a></li>
  </ul>
  <h2>All participants ({participants.length})</h2>
  <Participants participants={participants} />
</Page>
