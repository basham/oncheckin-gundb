<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { checkInStore, eventStore } from '@src/stores.js'
  import Layout from '@src/layouts/events.[id].svelte'
  import CheckInList from '@src/lib/list-check-in.svelte'

  const params = getContext('params')

  let state = STATE.LOADING
  let event = null
  let hares = []
  let runners = []

  onMount(async () => {
    event = await eventStore.get(params.id)
    const checkIns = (await checkInStore.getEventCheckIns(event?.id))
    hares = checkIns.filter(({ host }) => host)
    runners = checkIns.filter(({ host }) => !host)
    state = STATE.LOADED
  })
</script>

<Layout state={state}>
  <div class="u-flex u-flex-gap-4 u-m-top-6">
    <a
      class="button button--primary"
      href={`${event.url}/check-ins/new`}>
      New check-in
    </a>
    <a
      class="button"
      href={`${event.url}/roster`}>
      Print roster
    </a>
  </div>
  <h2>Hares <span class="badge">{hares.length}</span></h2>
  {#if hares.length}
    <div class="u-m-top-2">
      <CheckInList
        checkIns={hares}
        showCheckInCount={true}
        showHostCount={true} />
    </div>
  {/if}
  <h2>Runners <span class="badge">{runners.length}</span></h2>
  {#if runners.length}
    <div class="u-m-top-2">
      <CheckInList
        checkIns={runners}
        showCheckInCount={true}
        showHostCount={true} />
    </div>
  {/if}
</Layout>
