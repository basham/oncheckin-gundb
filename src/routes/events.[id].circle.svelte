<script>
  import { getContext, onMount } from 'svelte'
  import { checkInStore, eventStore } from '@src/stores.js'
  import Layout from '@src/layouts/events.[id].svelte'
  import CheckInList from '@src/lib/list-check-in.svelte'

  const params = getContext('params')

  let loaded = false
  let event = null
  let anniversaries = []
  let visitors = []
  let virgins = []

  onMount(async () => {
    event = await eventStore.get(params.id)
    const checkIns = (await checkInStore.getEventCheckInsWithStats(event?.id))
    anniversaries = checkIns
      .filter(({ checkInCount, host, specialCheckInCount, specialHostCount }) =>
        checkInCount > 0 && (specialCheckInCount || (host && specialHostCount))
      )
    virgins = checkIns
      .filter(({ checkInCount }) => checkInCount === 0)
    loaded = true
  })
</script>

<Layout
  loaded={loaded}
  title="Circle">
  <div class="card u-m-top-6">
    <h2>{`Anniversaries (${anniversaries.length})`}</h2>
    {#if anniversaries.length}
      <div class="u-m-top-4">
        <CheckInList checkIns={anniversaries} />
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
</Layout>
