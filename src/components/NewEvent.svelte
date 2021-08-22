<script>
  import { gun } from '../gun.js'
  import Breadcrumbs from './Breadcrumbs.svelte'
  import BreadcrumbsItem from './BreadcrumbsItem.svelte'
  import Page from './Page.svelte'

  const title = 'New event'
  let loading = true
  let orgName = ''
  let name = ''
  let date = (new Date()).toJSON().split('T')[0]

  gun.get('org').once((data) => {
    if (data) {
      orgName = data.name
    }
    loading = false
  })

  function submit (event) {
    event.preventDefault()
    gun.get('events').set({
      name,
      date
    })
    window.location = './'
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
      <label for="name">Name</label>
      <input
        bind:value={name}
        id="name"
        type="text">
    </div>
    <div class="u-m-top-4">
      <label for="date">Date</label>
      <input
        bind:value={date}
        id="date"
        type="date">
    </div>
    <div class="u-m-top-4">
      <button type="submit">Save</button>
    </div>
  </form>
</Page>
