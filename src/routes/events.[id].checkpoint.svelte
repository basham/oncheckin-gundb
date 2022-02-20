<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { checkInStore, eventStore } from '@src/stores.js'
  import Layout from '@src/layouts/events.[id].svelte'
  import Icon from '@src/lib/icon.svelte'

  const params = getContext('params')

  let state = STATE.LOADING
  let event = null
  let runners = []
  $: runnersMap = new Map(runners.map((checkIn) => [checkIn.participant.id, checkIn]))
  let arrivedIds = new Set()
  $: waiting = runners.filter(({ participant }) => !arrivedIds.has(participant.id))
  $: arrived = [...arrivedIds]
    .map((id) => runnersMap.get(id))
    .reverse()

  onMount(async () => {
    event = await eventStore.get(params.id)
    runners = (await checkInStore.getEventCheckIns(event?.id))
      .filter(({ host }) => !host)
    waiting = runners
    state = STATE.LOADED
  })

  function markAsArrived (event) {
    const { id } = event.target.dataset
    arrivedIds.add(id)
    arrivedIds = arrivedIds
  }

  function markAsWaiting (event) {
    const { id } = event.target.dataset
    arrivedIds.delete(id)
    arrivedIds = arrivedIds
  }

  function reset () {
    arrivedIds.clear()
    arrivedIds = arrivedIds
  }
</script>

<Layout state={state}>
  <div class="u-m-top-6">
    <button class="button" on:click={reset}>
      Reset
    </button>
  </div>
  <h2>Waiting <span class="badge">{waiting.length}</span></h2>
  {#if waiting.length}
    <ul class="link-list u-m-top-2">
      {#each waiting as checkIn}
        <li>
          <div class="link-item">
            <span
              class="link-item__primary"
              id={checkIn.participant.id}>
              {checkIn.participant.displayName}
            </span>
            <span class="link-item__secondary">{checkIn.participant.fullName}</span>
            <span class="link-item__tertiary u-text-num">
              <button
                aria-describedby={checkIn.participant.id}
                class="button"
                data-id={checkIn.participant.id}
                on:click={markAsArrived}>
                Arrived
              </button>
            </span>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
  <h2>Arrived <span class="badge">{arrived.length}</span></h2>
  {#if arrived.length}
    <ul class="link-list u-m-top-2">
      {#each arrived as checkIn}
        <li>
          <div class="link-item">
            <span
              class="link-item__primary"
              id={checkIn.participant.id}>
              {checkIn.participant.displayName}
            </span>
            <span class="link-item__secondary">{checkIn.participant.fullName}</span>
            <span class="link-item__tertiary u-text-num">
              <button
                aria-describedby={checkIn.participant.id}
                aria-label="Remove"
                class="button"
                data-id={checkIn.participant.id}
                on:click={markAsWaiting}>
                <Icon name="close" />
              </button>
            </span>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</Layout>
