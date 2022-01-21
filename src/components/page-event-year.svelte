<script>
  import { getYear } from 'date-fns'
  import { onMount } from 'svelte'
  import { eventStore } from '../stores.js'
  import Events from './events.svelte'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const year = params.get('year')

  const title = `Events in ${year}`

  let loading = true
  let events = []

  onMount(async () => {
    events = (await eventStore.getAll())
      .filter((event) => event.year === year)
      .reverse()
    loading = false
  })
</script>

<Page
  loading={loading}
  location='events'
  title={title}>
  <h1>{title}</h1>
  <h2>{`Events (${events.length})`}</h2>
  <div class="u-m-top-4x">
    <Events events={events} />
  </div>
</Page>
