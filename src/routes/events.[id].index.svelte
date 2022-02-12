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
    checkIns = (await checkInStore.getEventCheckIns(event?.id))
    state = STATE.LOADED
  })
</script>

<Layout state={state}>
  <div class="u-flex u-flex-space u-m-top-6">
    <h2 class="u-m-top-0">Check-ins <span class="badge">{checkIns.length}</span></h2>
    <a
      class="button button--primary button--small"
      href={`${event.url}/check-ins/new`}>
      New check-in
    </a>
  </div>
  {#if checkIns.length}
    <div class="u-m-top-2">
      <CheckInList
        checkIns={checkIns}
        showCheckInCount={true}
        showHostCount={true} />
    </div>
  {/if}
</Layout>
