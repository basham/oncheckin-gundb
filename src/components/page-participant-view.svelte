<script>
  import { get } from '../store.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const participantId = params.get('id')

  let title = ''
  let fullName = ''
  let loading = true
  let orgName = ''

  load()

  async function load () {
    const org = await get('org')
    orgName = org.data?.name

    const participant = await get(['participants', participantId], 'Participant')
    if (participant.data) {
      fullName = participant.data.fullName
      title = fullName
    } else {
      title = 'Participant not found'
    }

    loading = false
  }
</script>

<Page
  loading={loading}
  title={title}>
  <Breadcrumbs>
    <BreadcrumbsItem>{orgName}</BreadcrumbsItem>
    <BreadcrumbsItem href="?p=participants">Participants</BreadcrumbsItem>
    <BreadcrumbsItem isCurrent={true}>{title}</BreadcrumbsItem>
  </Breadcrumbs>
  <h1>
    {#if title}
      {title}
    {:else}
      <em>Participant</em>
    {/if}
  </h1>
  <p><a href={`?p=edit-participant&id=${participantId}`}>Edit</a></p>
</Page>
