<script>
  import { gun } from '../gun.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Page from './page.svelte'

  let title = ''
  let loading = true
  let orgName = ''

  const params = (new URL(document.location)).searchParams
  const eventId = params.get('id')

  gun.get('org').once((data) => {
    if (data) {
      orgName = data.name
    }
  })

  let date = ''
  gun.get('events').get(eventId).once((data) => {
    if (data) {
      title = data.name
      date = data.date
    } else {
      title = 'Event not found'
    }
    loading = false
  })
</script>

<Page
  loading={loading}
  title={title}>
  <Breadcrumbs>
    <BreadcrumbsItem>{orgName}</BreadcrumbsItem>
    <BreadcrumbsItem href="?p=events">Events</BreadcrumbsItem>
    <BreadcrumbsItem isCurrent={true}>{title}</BreadcrumbsItem>
  </Breadcrumbs>
  <h1>
    {#if title}
      {title}
    {:else}
      <em>Event</em>
    {/if}
  </h1>
  <p>{date}</p>
  <p><a href={`?p=edit-event&id=${eventId}`}>Edit</a></p>
</Page>
