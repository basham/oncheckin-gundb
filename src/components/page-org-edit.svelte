<script>
  import { delay, get, set } from '../earthstar.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Page from './page.svelte'

  const title = 'Edit organization'

  let loading = true
  let orgName = ''
  let name = ''

  load()

  async function load () {
    name = get('org/name.txt')
    orgName = name || 'Home'
    loading = false
  }

  async function submit (event) {
    event.preventDefault()
    set('org/name.txt', name)
    await delay(100)
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
