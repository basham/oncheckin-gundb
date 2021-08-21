<script>
  import { gun } from '../gun.js'
  import App from '../components/App.svelte'
  import Breadcrumbs from '../components/Breadcrumbs.svelte'
  import BreadcrumbsItem from '../components/BreadcrumbsItem.svelte'

  let title = ''
  let loading = true
  let orgName = ''

  const root = '../'
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

<App
  loading={loading}
  title={title}>
  <Breadcrumbs>
    <BreadcrumbsItem href={root}>{orgName}</BreadcrumbsItem>
    <BreadcrumbsItem href={`${root}events/`}>Events</BreadcrumbsItem>
    <BreadcrumbsItem isCurrent={true}>{title}</BreadcrumbsItem>
  </Breadcrumbs>
  {#if title}
    <h1>{title}</h1>
  {:else}
    <h1><em>Event</em></h1>
  {/if}
  <p>{date}</p>
  <p><a href={`${root}events/edit/?id=${eventId}`}>Edit</a></p>
</App>
