<script>
  import { eventStore, orgStore } from '../stores.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Page from './page.svelte'

  const title = 'New event'

  let loading = true
  let orgName = ''
  let name = ''
  let date = (new Date()).toJSON().split('T')[0]

  load()

  async function load () {
    orgName = orgStore.get()?.name
    loading = false
  }

  async function submit (ev) {
    ev.preventDefault()
    const event = await eventStore.create({ name, date })
    window.location = event.url
  }
</script>

<Page
  loading={loading}
  title={title}>
  <Breadcrumbs>
    <BreadcrumbsItem>{orgName}</BreadcrumbsItem>
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
