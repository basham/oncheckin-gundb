<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { checkInStore, participantStore } from '@src/stores.js'
  import Layout from '@src/layouts/participants.[id].svelte'

  const params = getContext('params')

  let state = STATE.LOADING
  let checkIns = []
  let participant

  onMount(async () => {
    participant = await participantStore.get(params.id)
    checkIns = await checkInStore.getParticipantCheckIns(participant.id)
    state = STATE.LOADED
  })
</script>

<Layout state={state}>
  <h2>{checkIns.length ? 'Check-ins' : 'No check-ins'}</h2>
  {#if checkIns.length}
    <ul class="link-list u-m-top-2">
      {#each checkIns as checkIn}
        <li>
          <a class="link-item" href={checkIn.event.url}>
            <span class="link-item__primary">{checkIn.event.name}</span>
            <span class="link-item__secondary">
              <span>{checkIn.event.displayDate}</span>
              {#if checkIn.count}
                <span>{`Run #${checkIn.count}`}</span>
              {/if}
              {#if checkIn.host}
                <span>{`Hare #${checkIn.hostCount}`}</span>
              {/if}
            </span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</Layout>
