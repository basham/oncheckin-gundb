<script>
  import { onMount } from 'svelte'
  import { eventStore } from '../stores.js'
  import Events from './events.svelte'
  import Page from './page.svelte'

  const title = 'Events'

  let loading = true
  let upcomingEvents = []
  let recentEvents = []
  let years = []

  onMount(async () => {
    upcomingEvents = await eventStore.getUpcoming()
    recentEvents = (await eventStore.getPast()).slice(0, 5)
    const eventYears = (await eventStore.getAll())
      .map(({ year }) => year)
    years = [...(new Set(eventYears))].sort().reverse()
    loading = false
  })
</script>

<style>
  .badge {
    background-color: var(--color-base-85);
    border-radius: var(--size-1);
    display: inline-block;
    padding: var(--size-2);
  }
</style>

<Page
  loading={loading}
  location='events'
  title={title}>
  <h1>{title}</h1>
  <ul class="list-inline">
    <li><a href="?p=new-event">New event</a></li>
  </ul>
  <h2>{`Upcoming events (${upcomingEvents.length})`}</h2>
  <Events events={upcomingEvents} />
  <h2>Recent events</h2>
  <Events events={recentEvents} />
  <h2>Past events</h2>
  <ul class="list-inline">
    {#each years as year}
      <li><a class="badge" href={`?p=events-year&year=${year}`}>{year}</a></li>
    {/each}
  </ul>
</Page>
