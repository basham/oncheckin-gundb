<script>
  import { onMount } from 'svelte'
  import { eventStore } from '@src/stores.js'
  import Events from '@src/lib/events.svelte'
  import Layout from './layout.svelte'

  export let params
  export let route

  const title = 'Events'

  let loaded = false
  let upcomingEvents = []
  let recentEvents = []
  let years = []

  onMount(async () => {
    upcomingEvents = await eventStore.getUpcoming()
    recentEvents = (await eventStore.getPast()).slice(0, 5)
    const eventYears = (await eventStore.getAll())
      .map(({ year }) => year)
    years = [...(new Set(eventYears))].sort().reverse()
    loaded = true
  })
</script>

<style>
  .badge {
    background-color: var(--color-base-80);
    border-radius: var(--size-1);
    display: inline-block;
    padding: var(--size-2);
  }
</style>

<Layout
  loaded={loaded}
  location='events'
  params={params}
  route={route}
  title={title}>
  <div class="card u-flex u-flex-space">
    <h1>{title}</h1>
    <a class="button button--primary button--small" href="?p=events/new">New event</a>
  </div>
  <div class="card u-m-top-6">
    <h2>{`Upcoming events (${upcomingEvents.length})`}</h2>
    <Events events={upcomingEvents} />
  </div>
  <div class="card u-m-top-6">
    <h2>Recent events</h2>
    <Events events={recentEvents} />
  </div>
  <div class="card u-m-top-6">
    <h2>Past events</h2>
    <ul class="list-inline u-m-top-4">
      {#each years as year}
        <li><a class="badge" href={`?p=events-year&year=${year}`}>{year}</a></li>
      {/each}
    </ul>
  </div>
</Layout>
