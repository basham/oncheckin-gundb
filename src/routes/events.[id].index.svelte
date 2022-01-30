<script>
  import { onMount } from 'svelte'
  import { checkInStore, eventStore } from '@src/stores.js'
  import Layout from '@src/layouts/events.[id].svelte'
  import CheckInList from '@src/lib/list-check-in.svelte'

  export let params
  export let route

  let loaded = false
  let event = null
  let checkIns = []

  onMount(async () => {
    event = await eventStore.get(params.id)
    checkIns = (await checkInStore.getEventCheckInsWithStats(event?.id))
    loaded = true
  })
</script>

<Layout
  loaded={loaded}
  params={params}
  route={route}>
  <div class="card u-m-top-6">
    <div class="u-flex u-flex-space">
      <h2>{`Check-ins (${checkIns.length})`}</h2>
      <a
        class="button button--primary button--small"
        href={`?p=events/${event?.id}/check-in`}>
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
