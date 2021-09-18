<script>
  import { participantStore } from '../stores.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Page from './page.svelte'

  const title = 'Edit participant'
  const params = (new URL(document.location)).searchParams
  const participantId = params.get('id')

  let loading = true
  let notFound = false
  let firstName = ''
  let lastName = ''
  let fullName = ''
  let url = ''

  load()

  async function load () {
    const participant = participantStore.get(participantId)
    firstName = participant?.firstName
    lastName = participant?.lastName
    fullName = participant?.fullName
    url = participant?.url
    notFound = !participant

    loading = false
  }

  async function submit (event) {
    event.preventDefault()
    await participantStore.set(participantId, { firstName, lastName })
    window.location = url
  }
</script>

<Page
  loading={loading}
  location='participants'
  notFound={notFound}
  title={[title, fullName]}>
  <Breadcrumbs>
    <BreadcrumbsItem href={url}>{fullName}</BreadcrumbsItem>
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
