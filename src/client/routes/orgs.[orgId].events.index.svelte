<script>
  import { getContext } from 'svelte'
  import Layout from '@src/client/layouts/org.svelte'
  import Events from '@src/client/lib/events.svelte'

  const { docId, heading, upcomingEvents, recentEvents, years } = getContext('data')


  /*
  onMount(async () => {
    upcomingEvents = await eventStore.getUpcoming(docId)
    recentEvents = (await eventStore.getPast(docId)).slice(0, 5)
    const eventYears = (await eventStore.getAll(docId))
      .map(({ year }) => year)
    years = [...(new Set(eventYears))].sort().reverse()
    state = STATE.LOADED
  })
  */
</script>

<Layout>
  <div class="u-flex u-flex-end u-flex-space">
    <h1>{heading}</h1>
    <div>
      <a class="button button--primary" href={`/doc/${docId}/events/new`}>New event</a>
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
          href={`/doc/${docId}/events/past/${year}`}>
          <span class="row__primary">{year}</span>
        </a>
      </li>
    {/each}
  </ul>
</Layout>
