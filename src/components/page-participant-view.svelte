<script>
  import { get, getParticipant } from '../earthstar.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const participantId = params.get('id')

  let title = ''
  let loading = true
  let notFound = false
  let orgName = ''

  load()

  async function load () {
    orgName = get('org/name.txt')

    const participant = getParticipant(participantId)
    console.log(participant)
    title = participant?.fullName
    notFound = !participant

    loading = false
  }
</script>

<Page
  loading={loading}
  notFound={notFound}
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
