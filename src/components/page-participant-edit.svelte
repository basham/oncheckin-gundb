<script>
  import { get, set } from '../store.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Page from './page.svelte'

  const title = 'Edit participant'
  const params = (new URL(document.location)).searchParams
  const participantId = params.get('id')

  let loading = true
  let orgName = ''
  let firstName = ''
  let lastName = ''
  let fullName = ''

  load()

  async function load () {
    const org = await get('org')
    orgName = org.data?.name

    const participant = await get(['participants', participantId])
    if (participant.data) {
      firstName = participant.data.firstName
      lastName = participant.data.lastName
      fullName = `${participant.data.firstName} ${participant.data.lastName}`
    }

    loading = false
  }

  async function submit (event) {
    event.preventDefault()
    await set(['participants', participantId], { firstName, lastName })
    window.location = `./?p=participant&id=${participantId}`
  }
</script>

<Page
  loading={loading}
  title={title}>
  <Breadcrumbs>
    <BreadcrumbsItem>{orgName}</BreadcrumbsItem>
    <BreadcrumbsItem href="?p=participants">Participants</BreadcrumbsItem>
    <BreadcrumbsItem href={`?p=participant&id=${participantId}`}>{fullName}</BreadcrumbsItem>
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
