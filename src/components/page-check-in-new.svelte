<script>
  import { attendanceStore, eventStore, participantStore } from '../stores.js'
  import Checkbox from './checkbox.svelte'
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
    return participant.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1
  }

  function selectParticipant (participant) {
    selectedParticipant = participant.checkedIn ? null : participant
  }
</script>

<Page
  loading={loading}
  location='events'
  notFound={notFound}
  title={[title, `${eventName} (${eventDate})`]}>
  <h1>{title}</h1>
  <h2><a href={eventUrl}>{eventName}</a> ({eventDate})</h2>
  <RadioGroup
    legend="Check in"
    name="checkin"
    onSelected={selectCheckInType}
    options={['Existing participant', 'New participant']}
    selected={0} />
  {#if checkInType === 'existing-participant'}
    <Lookup
      filter={filterResult}
      isSelected={({ checkedIn }) => checkedIn}
      label="Look up participant"
      onSelected={selectParticipant}
      options={participants}
      render={({ fullName }) => fullName} />
    {#if selectedParticipant}
      <div class="u-m-top-6">
        <h2>{selectedParticipant.fullName}</h2>
      </div>
    {/if}
  {/if}
  {#if checkInType === 'new-participant'}
    <h2>New participant</h2>
    <div class="u-m-top-6">
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
  {/if}
  <Checkbox
    id="host"
    label="Host of this event" />
  <RadioGroup
    legend="Payment"
    name="payment"
    options={paymentOptions} />
  <div class="u-m-top-6">
    <button type="submit">Save</button>
  </div>
  <p><a href={eventUrl}>Back</a></p>
</Page>
