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
  let attendees = []
  let participants = []
  const paymentOptions = ['Cash', 'Card', 'Venmo', 'IOU', 'Waived']

  load()

  async function load () {
    const event = eventStore.get(eventId)
    eventName = event?.name
    eventDate = event?.displayDate
    eventUrl = event?.url
    notFound = !event

    attendees = attendanceStore.getAttendees(eventId)
      .map((p) => {
        const nameId = `${p.id}-name`
        return { ...p, nameId }
      })

    const attendeeIds = attendees
      .map((p) => p.id)
      .join('-')

    participants = participantStore.getAll()
      .filter((p) => !attendeeIds.includes(p.id))

    loading = false
  }

  function filterResult (query, participant) {
    return participant.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1
  }

  async function addParticipant (participant) {
    await attendanceStore.addAttendee(eventId, participant.id)
    await load()
  }
</script>

<style>

</style>

<Page
  loading={loading}
  location='events'
  notFound={notFound}
  title={[title, `${eventName} (${eventDate})`]}>
  <h1>{title}</h1>
  <h2><a href={eventUrl}>{eventName}</a> ({eventDate})</h2>
  <Lookup
    filter={filterResult}
    label="Find participant"
    onSelected={addParticipant}
    options={participants}
    render={({ fullName }) => fullName} />
  <Checkbox
    id="host"
    label="Host" />
  <RadioGroup
    legend="Payment"
    name="payment"
    options={paymentOptions} />

  <div class="u-m-top-6">
    <button type="submit">Save</button>
  </div>
  <p><a href={eventUrl}>Back</a></p>
</Page>
