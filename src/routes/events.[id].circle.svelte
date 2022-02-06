<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { checkInStore, eventStore } from '@src/stores.js'
  import { sortAsc } from '@src/util.js'
  import Layout from '@src/layouts/events.[id].svelte'
  import CheckInList from '@src/lib/list-check-in.svelte'

  const params = getContext('params')

  let state = STATE.LOADING
  let event = null
  let hosts = []
  let specialHosts = []
  let anniversaries = []
  let visitors = []
  let virgins = []
  let namings = []

  onMount(async () => {
    event = await eventStore.get(params.id)
    const checkIns = (await checkInStore.getEventCheckIns(event?.id))
    hosts = checkIns
      .filter(({ host }) => host)
    specialHosts = hosts
      .filter(({ specialHostCount }) => specialHostCount)
      .sort(sortAsc('hostCount'))
    anniversaries = checkIns
      .filter(({ specialCheckInCount }) => specialCheckInCount)
      .sort(sortAsc('checkInCount'))
    virgins = checkIns
      .filter(({ checkInCount }) => checkInCount === 0)
    namings = checkIns
      .filter(({ readyForNaming }) => readyForNaming)
    state = STATE.LOADED
  })
</script>

<Layout
  state={state}
  title="Circle">
  <div class="card u-m-top-6">
    <h2>{`Hares (${hosts.length})`}</h2>
    {#if hosts.length}
      <div class="u-m-top-4">
        <CheckInList checkIns={hosts} />
      </div>
    {/if}
  </div>
  <div class="card u-m-top-6">
    <h2>{`Hare-iversaries (${specialHosts.length})`}</h2>
    {#if specialHosts.length}
      <div class="u-m-top-4">
        <CheckInList
          checkIns={specialHosts}
          showHostCount={true} />
      </div>
    {/if}
  </div>
  <div class="card u-m-top-6">
    <h2>{`Anniversaries (${anniversaries.length})`}</h2>
    {#if anniversaries.length}
      <div class="u-m-top-4">
        <CheckInList
          checkIns={anniversaries}
          showCheckInCount={true} />
      </div>
    {/if}
  </div>
  <div class="card u-m-top-6">
    <h2>{`Visitors (${visitors.length})`}</h2>
    {#if visitors.length}
      <div class="u-m-top-4">
        <CheckInList checkIns={visitors} />
      </div>
    {/if}
  </div>
  <div class="card u-m-top-6">
    <h2>{`Virgins (${virgins.length})`}</h2>
    {#if virgins.length}
      <div class="u-m-top-4">
        <CheckInList checkIns={virgins} />
      </div>
    {/if}
  </div>
  <div class="card u-m-top-6">
    <h2>{`Namings (${namings.length})`}</h2>
    {#if namings.length}
      <div class="u-m-top-4">
        <CheckInList
          checkIns={namings}
          showCheckInCount={true} />
      </div>
    {/if}
  </div>
</Layout>
