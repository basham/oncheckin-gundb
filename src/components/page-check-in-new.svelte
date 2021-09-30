<script>
  import { attendanceStore, eventStore, participantStore } from '../stores.js'
  import { focus } from '../util.js'
  import Checkbox from './checkbox.svelte'
  import Fieldset from './fieldset.svelte'
  import Icon from './icon.svelte'
  import Lookup from './lookup.svelte'
  import Page from './page.svelte'
  import RadioGroup from './radio-group.svelte'

  const params = (new URL(document.location)).searchParams
  const eventId = params.get('id')
  const title = 'New check-in'

  let loading = true
  let notFound = false
  let eventName = ''
  let eventDate = ''
  let eventUrl = ''
  let participants = []
  let checkInType = 'existing-participant'
  let selectedParticipant = null
  let firstName = ''
  let lastName = ''
  const paymentOptions = ['Cash', 'Prepaid card', 'Online', 'IOU', 'Waived']

  load()

  async function load () {
    const event = eventStore.get(eventId)
    eventName = event?.name
    eventDate = event?.displayDate
    eventUrl = event?.url
    notFound = !event

    const attendeeIds = attendanceStore.getAttendees(eventId)
      .map((p) => p.id)
      .join('-')

    participants = participantStore.getAll()
      .map((p) => {
        const checkedIn = attendeeIds.includes(p.id)
        return { ...p, checkedIn }
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
    if (!participant.checkedIn) {
      selectedParticipant = participant
      focus('unselect-participant')
    }
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
  title={[title, `${eventName} (${eventDate})`]}>
  <h1>{title}</h1>
  <h2><a href={eventUrl}>{eventName}</a> ({eventDate})</h2>
  <form
    autocomplete="off"
    class="u-m-top-6"
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
        <div class="u-m-top-4">
          <label for="firstNameInput">First name</label>
          <br>
          <input
            bind:value={firstName}
            id="firstNameInput"
            type="text">
        </div>
        <div class="u-m-top-6">
          <label for="lastNameInput">Last name</label>
          <br>
          <input
            bind:value={lastName}
            id="lastNameInput"
            type="text">
        </div>
      </Fieldset>
    {/if}
    <Fieldset>
      <Checkbox
        checked={true}
        id="arrived"
        label="Arrived at this event" />
      <Checkbox
        class="u-m-top-2"
        id="host"
        label="Host of this event" />
    </Fieldset>
    <RadioGroup
      legend="Payment"
      name="payment"
      options={paymentOptions} />
    <div class="u-m-top-4">
      <button type="submit">Save</button>
    </div>
    <p><a href={eventUrl}>Back</a></p>
  </form>
</Page>
