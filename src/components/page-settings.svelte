<script>
  import { orgStore } from '../stores.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Page from './page.svelte'

  const title = 'Settings'

  let loading = true
  let orgName = ''
  let name = ''

  load()

  async function load () {
    name = orgStore.get()?.name
    orgName = name
    loading = false
  }

  async function submit (event) {
    event.preventDefault()
    await orgStore.set({ name })
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
      <label for="name">Organization name</label>
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
