<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { checkInStore, eventStore } from '@src/ui/stores.js'
  import { sortAsc } from '@src/util.js'
  import Layout from '@src/ui/layouts/events.[id].svelte'
  import CheckInList from '@src/ui/lib/list-check-in.svelte'

  const { docId, eventId } = getContext('params')

  let state = STATE.LOADING
  let event = null
  let hosts = []
  let specialHosts = []
  let specialRuns = []
  let visitors = []
  let virgins = []
  let namings = []

  onMount(async () => {
    event = await eventStore.get(docId, eventId)
    const checkIns = (await checkInStore.getEventCheckIns(docId, eventId))
    hosts = checkIns
      .filter(({ host }) => host)
    specialHosts = hosts
      .filter(({ specialHostCount }) => specialHostCount)
      .sort(sortAsc('hostCount'))
    specialRuns = checkIns
      .filter(({ specialCount }) => specialCount)
      .sort(sortAsc('count'))
    virgins = checkIns
      .filter(({ count }) => count === 1)
    namings = checkIns
      .filter(({ readyForNaming }) => readyForNaming)
    state = STATE.LOADED
  })
</script>

<Layout
  state={state}
  title="Circle">
  <h2>Hares <span class="badge">{hosts.length}</span></h2>
  {#if hosts.length}
    <div class="u-m-top-2">
      <CheckInList checkIns={hosts} />
    </div>
  {/if}
  <h2>Hare-iversaries <span class="badge">{specialHosts.length}</span></h2>
  {#if specialHosts.length}
    <div class="u-m-top-2">
      <CheckInList
        checkIns={specialHosts}
        showHostCount={true} />
    </div>
  {/if}
  <h2>Run-iversaries <span class="badge">{specialRuns.length}</span></h2>
  {#if specialRuns.length}
    <div class="u-m-top-2">
      <CheckInList
        checkIns={specialRuns}
        showCheckInCount={true} />
    </div>
  {/if}
  <h2>Visitors <span class="badge">{visitors.length}</span></h2>
  {#if visitors.length}
    <div class="u-m-top-2">
      <CheckInList checkIns={visitors} />
    </div>
  {/if}
  <h2>Virgins <span class="badge">{virgins.length}</span></h2>
  {#if virgins.length}
    <div class="u-m-top-2">
      <CheckInList checkIns={virgins} />
    </div>
  {/if}
  <h2>Namings <span class="badge">{namings.length}</span></h2>
  {#if namings.length}
    <div class="u-m-top-2">
      <CheckInList
        checkIns={namings}
        showCheckInCount={true} />
    </div>
  {/if}
</Layout>
