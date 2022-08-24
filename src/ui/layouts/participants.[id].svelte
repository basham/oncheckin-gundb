<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { checkInStore, participantStore } from '@src/ui/stores.js'
  import { pluralize } from '@src/util.js'
  import NavLink from '@src/ui/lib/nav-link.svelte'
  import Layout from '@src/ui/layouts/workspace.svelte'

  export let state = STATE.LOADED
  export let title = ''

  const { docId, participantId } = getContext('params')
  const route = getContext('route').split('/')[3]

  let _title = ''
  let _state = STATE.LOADING
  let latestCheckIn
  let participant

  onMount(async () => {
    participant = await participantStore.get(docId, participantId)
    _title = `${title ? `${title}: ` : ''}${participant?.displayName}`
    if (!participant) {
      _state = STATE.NOT_FOUND
      return
    }
    const checkIns = await checkInStore.getParticipantCheckIns(docId, participantId)
    latestCheckIn = checkIns[0]
    _state = STATE.LOADED
  })
</script>

<Layout
  state={[state, _state]}
  title={_title}>
  <h1>{participant.displayName}</h1>
  <p class="u-m-top-2">
    <span>{participant.fullName}</span>
    {#if latestCheckIn}
      <span class="u-m-lr-1">&middot;</span>
      <span>{`${latestCheckIn?.count} ${pluralize(latestCheckIn?.count, 'run')}`}</span>
      <span class="u-m-lr-1">&middot;</span>
      <span>{`${latestCheckIn?.hostCount} ${pluralize(latestCheckIn?.hostCount, 'hare')}`}</span>
    {/if}
  </p>
  <nav class="list-plain list-plain--inline u-border-bottom u-gap-4 u-m-top-4 u-p-bottom-4">
    <NavLink
      href={participant.url}
      id="index"
      location={route}>
      Runs
    </NavLink>
    <NavLink
      href={`${participant.url}/hares`}
      id="hares"
      location={route}>
      Hares
    </NavLink>
    <NavLink
      href={`${participant.url}/edit`}
      id="edit"
      location={route}>
      Edit
    </NavLink>
  </nav>
  <slot></slot>
</Layout>
