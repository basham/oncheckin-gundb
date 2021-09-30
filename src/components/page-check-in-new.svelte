<script>
  import { attendanceStore, eventStore, participantStore } from '../stores.js'
  import { focus } from '../util.js'
  import Fieldset from './fieldset.svelte'
  import FieldsetCheckIn from './fieldset-check-in.svelte'
  import FieldsetParticipantName from './fieldset-participant-name.svelte'
  import Icon from './icon.svelte'
  import Lookup from './lookup.svelte'
  import Page from './page.svelte'
  import RadioGroup from './radio-group.svelte'

  const params = (new URL(document.location)).searchParams
  const eventId = params.get('id')

  const title = 'New check-in'
  let pageTitle = ''
  let loading = true
  let notFound = false
  let event = null
  let participants = []
  let checkInType = 'existing-participant'
  let selectedParticipant = null
  let firstName = ''
  let lastName = ''
  let alias = ''

  load()

  async function load () {
    event = eventStore.get(eventId)
    pageTitle = `${title} for ${event?.name} (${event?.displayDate})`
    notFound = !event

    const checkIns = attendanceStore.getAttendees(eventId)
      .map((checkIn) => [checkIn.id, checkIn])
    const checkInsMap = new Map(checkIns)
    participants = participantStore.getAll()
      .map((p) => {
        const checkIn = checkInsMap.get(p.id)
        const checkedIn = !!checkIn
        return {
          ...p,
          ...checkIn,
          checkedIn
        }
      })

    loading = false
  }

  function selectCheckInType (event) {
    checkInType = event.target.value
  }

  function filterResult (query, participant) {
    const terms = [participant.fullName, participant.displayName].join(' ')
    return terms.toLowerCase().indexOf(query.toLowerCase()) !== -1
  }

  function selectParticipant (participant) {
    if (participant.checkedIn) {
      window.location = participant.checkInUrl
      return
    }

    selectedParticipant = participant
    focus('unselect-participant')
  }

  function unselectParticipant () {
    selectedParticipant = null
    focus('find-participant-input')
  }

  function submit (event) {
    event.preventDefault()
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

<Page
  loading={loading}
  location='events'
  notFound={notFound}
  title={pageTitle}>
  <h1>{title}</h1>
  <p
    aria-label="Event"
    role="group">
    <a class="u-ts-3" href={event?.url}>{event?.name}</a>
    <br>
    {event?.displayDate}
  </p>
  <form
    autocomplete="off"
    on:submit={submit}>
    <RadioGroup
      legend="Check in"
      name="checkin"
      onSelected={selectCheckInType}
      options={['Existing participant', 'New participant']}
      selected={0} />
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
              class="button--secondary button--small"
              id="unselect-participant"
              on:click={unselectParticipant}>
              <Icon name="close" />
            </button>
          </div>
        </Fieldset>
      {/if}
    {/if}
    {#if checkInType === 'new-participant'}
      <Fieldset legend="New participant">
        <FieldsetParticipantName
          bind:firstName={firstName}
          bind:lastName={lastName}
          bind:alias={alias} />
      </Fieldset>
    {/if}
    <FieldsetCheckIn />
    <div class="u-m-top-4">
      <button class="button button--primary" type="submit">Save</button>
    </div>
    <p><a href={event?.url}>Back</a></p>
  </form>
</Page>
