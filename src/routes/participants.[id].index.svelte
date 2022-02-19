<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { checkInStore, participantStore } from '@src/stores.js'
  import Layout from '@src/layouts/participants.[id].svelte'
  import { pluralize } from '@src/util.js'

  const params = getContext('params')

  let state = STATE.LOADING
  let checkIns = []
  let participant

  onMount(async () => {
    participant = await participantStore.get(params.id)
    const checkInsByYear = (await checkInStore.getParticipantCheckIns(participant.id))
      .reduce((yearMap, checkIn) => {
        const { year } = checkIn.event
        if (!yearMap.has(year)) {
          yearMap.set(year, [])
        }
        yearMap.set(year, [...yearMap.get(year), checkIn])
        return yearMap
      }, new Map())
    checkIns = [...checkInsByYear]
    state = STATE.LOADED
  })
</script>

<Layout state={state}>
  {#each checkIns as [year, checkInsThisYear]}
    <h2>{year} <span class="badge">{checkInsThisYear.length}</span></h2>
    <ul class="link-list u-m-top-2">
      {#each checkInsThisYear as checkIn}
        <li>
          <a class="link-item" href={checkIn.event.url}>
            <span class="link-item__primary">{checkIn.event.name}</span>
            <span class="link-item__secondary u-text-num">{`#${checkIn.event.count}: ${checkIn.event.displayDateMedium}`}</span>
            <span class="link-item__tertiary u-text-num">{`${checkIn.count} ${pluralize(checkIn.count, 'run')}`}</span>
          </a>
        </li>
      {/each}
    </ul>
  {/each}
</Layout>
