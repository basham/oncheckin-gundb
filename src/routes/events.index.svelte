<script>
  import { onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { eventStore } from '@src/stores.js'
  import Layout from '@src/layouts/workspace.svelte'
  import Events from '@src/lib/events.svelte'

  const title = 'Events'

  let state = STATE.LOADING
  let upcomingEvents = []
  let recentEvents = []
  let years = []

  onMount(async () => {
    upcomingEvents = await eventStore.getUpcoming()
    recentEvents = (await eventStore.getPast()).slice(0, 5)
    const eventYears = (await eventStore.getAll())
      .map(({ year }) => year)
    years = [...(new Set(eventYears))].sort().reverse()
    state = STATE.LOADED
  })
</script>

<Layout
  state={state}
  title={title}>
  <div class="u-flex u-flex-end u-flex-space">
    <h1>{title}</h1>
    <div>
      <a class="button button--primary" href="?p=events/new">New event</a>
    </div>
  </div>
  <h2>Upcoming events <span class="badge">{upcomingEvents.length}</span></h2>
  <Events events={upcomingEvents} />
  <h2>Recent events</h2>
  <Events events={recentEvents} />
  <h2>Past events</h2>
  <ul class="list-plain list-plain--inline u-gap-2px u-m-top-2">
    {#each years as year}
      <li class="row">
        <a
          class="row__left u-text-num"
          href={`?p=events/past/${year}`}>
          <span class="row__primary">{year}</span>
        </a>
      </li>
    {/each}
  </ul>
</Layout>
