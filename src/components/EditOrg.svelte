<script>
  import { gun } from '../gun.js'
  import Breadcrumbs from './Breadcrumbs.svelte'
  import BreadcrumbsItem from './BreadcrumbsItem.svelte'
  import Page from './Page.svelte'

  const title = 'Edit organization'
  let loading = true
  let orgName = ''
  let name = ''

  gun.get('org').once((data) => {
    if (data) {
      orgName = data.name
      name = data.name
    }
    loading = false
  })

  function submit (event) {
    event.preventDefault()
    gun.get('org').put({ name })
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
      <button type="submit">Save</button>
    </div>
  </form>
</Page>
