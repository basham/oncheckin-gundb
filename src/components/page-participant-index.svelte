<script>
  import { orgStore, participantStore } from '../stores.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Participants from './participants.svelte'
  import Page from './page.svelte'

  const title = 'Participants'

  let loading = true
  let orgName = ''
  let participants = []

  load()

  async function load () {
    orgName = orgStore.get()?.name
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
  <Breadcrumbs>
    <BreadcrumbsItem>{orgName}</BreadcrumbsItem>
    <BreadcrumbsItem isCurrent={true}>{title}</BreadcrumbsItem>
  </Breadcrumbs>
  <h1>{title}</h1>
  <ul class="toolbar">
    <li><a href="?p=new-participant">New participant</a></li>
  </ul>
  <Participants participants={participants} />
</Page>
