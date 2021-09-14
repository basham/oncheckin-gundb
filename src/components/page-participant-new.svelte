<script>
  import { append, get } from '../store.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Page from './page.svelte'

  const title = 'New participant'

  let loading = true
  let orgName = ''
  let firstName = ''
  let lastName = ''

  load()

  async function load () {
    const org = await get('org')
    orgName = org.data?.name

    loading = false
  }

  async function submit (event) {
    event.preventDefault()
    await append('participants', { firstName, lastName })
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
      <label for="firstNameInput">First name</label>
      <input
        bind:value={firstName}
        id="firstNameInput"
        type="text">
    </div>
    <div class="u-m-top-4">
      <label for="lastNameInput">Last name</label>
      <input
        bind:value={lastName}
        id="lastNameInput"
        type="text">
    </div>
    <div class="u-m-top-4">
      <button type="submit">Save</button>
    </div>
  </form>
</Page>
