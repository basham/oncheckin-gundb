<script>
  import { eventStore, orgStore } from '../stores.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Events from './events.svelte'
  import Page from './page.svelte'

  const title = 'Events'

  let loading = true
  let orgName = ''
  let events = []
  let upcomingEvents = []
  let pastEvents = []

  load()

  async function load () {
    orgName = orgStore.get()?.name
    events = eventStore.getAll()
    upcomingEvents = eventStore.getUpcoming()
    pastEvents = eventStore.getPast()
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
    <li><a href="?p=new-event">New event</a></li>
  </ul>
  <h2>Upcoming events ({upcomingEvents.length})</h2>
  <Events events={upcomingEvents} />
  <h2>Past events ({pastEvents.length})</h2>
  <Events events={pastEvents} />
</Page>
