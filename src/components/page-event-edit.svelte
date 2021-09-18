<script>
  import { eventStore, orgStore } from '../stores.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const eventId = params.get('id')
  const title = 'Edit event'

  let loading = true
  let notFound = false
  let orgName = ''
  let eventName = ''
  let name = ''
  let date = (new Date()).toJSON().split('T')[0]

  load()

  async function load () {
    orgName = orgStore.get()?.name
    const event = eventStore.get(eventId)
    name = event?.name
    date = event?.date
    eventName = name
    notFound = !event
    loading = false
  }

  async function submit (event) {
    event.preventDefault()
    await eventStore.set(eventId, { name, date })
    window.location = './'
  }
</script>

<Page
  loading={loading}
  notFound={notFound}
  title={title}>
  <Breadcrumbs>
    <BreadcrumbsItem>{orgName}</BreadcrumbsItem>
    <BreadcrumbsItem href="?p=events">Events</BreadcrumbsItem>
    <BreadcrumbsItem>{eventName}</BreadcrumbsItem>
    <BreadcrumbsItem isCurrent={true}>{title}</BreadcrumbsItem>
  </Breadcrumbs>
  <h1>{title}</h1>
  <form
    autocomplete="off"
    on:submit={submit}>
    <div class="u-m-top-4">
      <label for="nameInput">Name</label>
      <input
        bind:value={name}
        id="nameInput"
        type="text">
    </div>
    <div class="u-m-top-4">
      <label for="dateInput">Date</label>
      <input
        bind:value={date}
        id="dateInput"
        type="date">
    </div>
    <div class="u-m-top-4">
      <button type="submit">Save</button>
    </div>
  </form>
</Page>
