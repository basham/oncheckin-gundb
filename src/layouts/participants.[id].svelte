<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { checkInStore, participantStore } from '@src/stores.js'
  import { pluralize } from '@src/util.js'
  import NavLink from '@src/lib/nav-link.svelte'
  import Layout from '@src/layouts/workspace.svelte'

  export let state = STATE.LOADED
  export let title = ''

  const params = getContext('params')
  const route = getContext('route')

  let _title = ''
  let _state = STATE.LOADING
  let latestCheckIn
  let participant

  onMount(async () => {
    participant = await participantStore.get(params.id)
    _title = `${title ? `${title}: ` : ''}${participant?.displayName}`
    if (!participant) {
      _state = STATE.NOT_FOUND
      return
    }
    const checkIns = await checkInStore.getParticipantCheckIns(participant.id)
    latestCheckIn = checkIns[0]
    _state = STATE.LOADED
  })
</script>

<Layout
  state={[state, _state]}
  title={_title}>
  <h1>{participant.displayName}</h1>
  <p class="u-m-top-4">{participant.fullName}</p>
  {#if latestCheckIn}
    <p>{latestCheckIn?.count} {pluralize(latestCheckIn?.count, 'hash', 'hashes')}, {latestCheckIn?.hostCount} {pluralize(latestCheckIn?.hostCount, 'hare')}</p>
  {/if}
  <nav class="list-inline u-border-bottom u-m-top-4 u-p-bottom-4">
    <NavLink
      href={participant.url}
      id="participants/[id]/index"
      location={route}>
      Check-ins
    </NavLink>
    <NavLink
      href={`${participant.url}/edit`}
      id="participants/[id]/edit"
      location={route}>
      Edit
    </NavLink>
  </nav>
  <slot></slot>
</Layout>
