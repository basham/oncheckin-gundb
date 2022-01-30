<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { checkInStore, eventStore } from '@src/stores.js'
  import Layout from '@src/layouts/events.[id].svelte'
  import CheckInList from '@src/lib/list-check-in.svelte'

  const params = getContext('params')

  let state = STATE.LOADING
  let event = null
  let checkIns = []

  onMount(async () => {
    event = await eventStore.get(params.id)
    checkIns = (await checkInStore.getEventCheckInsWithStats(event?.id))
    state = STATE.LOADED
  })
</script>

<Layout state={state}>
  <div class="card u-m-top-6">
    <div class="u-flex u-flex-space">
      <h2>{`Check-ins (${checkIns.length})`}</h2>
      <a
        class="button button--primary button--small"
        href={`${event.url}/check-ins/new`}>
        New check-in
      </a>
    </div>
    {#if checkIns.length}
      <div class="u-m-top-4">
        <CheckInList checkIns={checkIns} />
      </div>
    {/if}
  </div>
</Layout>
