<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { checkInStore, eventStore, participantStore } from '@src/ui/stores.js'
  import { focus } from '@src/util.js'
  import Layout from '@src/ui/layouts/events.[id].svelte'
  import Fieldset from '@src/ui/lib/fieldset.svelte'
  import FieldsetCheckIn from '@src/ui/lib/fieldset-check-in.svelte'
  import FieldsetParticipantName from '@src/ui/lib/fieldset-participant-name.svelte'
  import Icon from '@src/ui/lib/icon.svelte'
  import Lookup from '@src/ui/lib/lookup.svelte'
  import RadioGroup from '@src/ui/lib/radio-group.svelte'

  const { docId, eventId } = getContext('params')
  const title = 'New check-in'

  let state = STATE.LOADING
  let event = null
  let participants = []
  let checkInType = 'existing-participant'
  let selectedParticipant = null
  let fullName = ''
  let alias = ''
  let host = false

  onMount(async () => {
    event = await eventStore.get(docId, eventId)

    const checkIns = (await checkInStore.getEventCheckIns(docId, eventId))
      .map((checkIn) => [checkIn.participant.id, checkIn])
    const checkInsMap = new Map(checkIns)
    participants = (await participantStore.getAll(docId))
      .map((p) => {
        const checkIn = checkInsMap.get(p.id)
        const checkedIn = !!checkIn
        return {
          ...p,
          checkIn,
          checkedIn
        }
      })

    state = STATE.LOADED
  })

  function filterResult (query, participant) {
    const terms = [participant.fullName, participant.displayName].join(' ')
    return terms.toLowerCase().indexOf(query.toLowerCase()) !== -1
  }

  function selectParticipant (participant) {
    if (participant.checkedIn) {
      window.location = participant.checkIn.url
      return
    }

    selectedParticipant = participant
    focus('unselect-participant')
  }

  function unselectParticipant () {
    selectedParticipant = null
    focus('find-participant-input')
  }

  async function submit (e) {
    e.preventDefault()
    if (checkInType === 'new-participant') {
      selectedParticipant = await participantStore.create(docId, { alias, fullName })
    }
    if (!selectedParticipant && checkInType === 'existing-participant') {
      focus('find-participant-input')
      return
    }
    await checkInStore.create(docId, eventId, selectedParticipant.id, { host })
    window.location = event.url
  }
</script>

<style>
  :global(.find-participant label) {
    font-size: var(--fs-2);
    line-height: var(--lh-2);
  }

  .participant {
    align-items: flex-start;
    display: flex;
  }

  .participant .name {
    flex-grow: 1;
  }
</style>

<Layout
  state={state}
  title={title}>
  <h2>{title}</h2>
  <form
    autocomplete="off"
    on:submit={submit}>
    <RadioGroup
      bind:value={checkInType}
      legend="Check in"
      name="checkin"
      options={['Existing participant', 'New participant']} />
    {#if checkInType === 'existing-participant'}
      {#if !selectedParticipant}
        <Fieldset>
          <Lookup
            class="find-participant"
            filter={filterResult}
            id="find-participant"
            isSelected={({ checkedIn }) => checkedIn}
            label="Find participant"
            onSelected={selectParticipant}
            options={participants}
            render={({ displayName, fullName }) => `${displayName} (${fullName})`} />
        </Fieldset>
      {:else}
        <Fieldset>
          <div class="participant">
            <div
              class="name"
              id="selectedParticipantName">
              <div class="u-ts-2">{selectedParticipant.displayName}</div>
              <div>{selectedParticipant.fullName}</div>
            </div>
            <button
              aria-label="Unselect"
              aria-describedby="selectedParticipantName"
              class="button button--small"
              id="unselect-participant"
              on:click={unselectParticipant}
              type="button">
              <Icon name="close" />
            </button>
          </div>
        </Fieldset>
      {/if}
    {/if}
    {#if checkInType === 'new-participant'}
      <Fieldset legend="New participant">
        <div class="u-m-top-4">
          <FieldsetParticipantName
            bind:fullName={fullName}
            bind:alias={alias} />
        </div>
      </Fieldset>
    {/if}
    <FieldsetCheckIn bind:host={host} />
    <div class="u-m-top-4">
      <button
        class="button button--primary"
        type="submit">
        Save
      </button>
    </div>
    <p class="u-m-top-4"><a href={event.url}>Back</a></p>
  </form>
</Layout>
