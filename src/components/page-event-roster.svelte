<script>
  import { format, sub } from 'date-fns'
  import { checkInStore, eventStore, participantStore } from '../stores.js'
  import Icon from './icon.svelte'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const eventId = params.get('id')

  let title = ''
  let loading = true
  let notFound = false
  let event = null
  let returnersCutoff = ''
  let participants = []

  load()

  async function load () {
    event = eventStore.get(eventId)
    title = `Roster for ${event?.name} (${event?.displayDate})`
    notFound = !event

    returnersCutoff = format(sub(event?.dateObj, { months: 2 }), 'MMM d')

    const checkIns = checkInStore.getEventCheckIns(eventId)
      .map((checkIn) => [checkIn.participant.id, checkIn])
    const checkInsMap = new Map(checkIns)
    participants = participantStore.getAll()
      .map((p) => {
        const checkIn = checkInsMap.get(p.id)
        const checkedIn = !!checkIn
        const checkInCount = randomNum(1, 550)
        const highlightCheckInCount = checkInCount % 5 === 0
        const highlightName = checkInCount > 5 && !p.alias
        const hostCount = randomNum(0, checkInCount)
        return {
          ...p,
          checkIn,
          checkInCount,
          checkedIn,
          highlightCheckInCount,
          highlightName,
          hostCount,
          lastEventDate: 'Sep 20'
        }
      })
      .sort((a, b) => {
        if (a.checkIn?.host && !b.checkIn?.host) {
          return -1
        }
        if (a.checkedIn && !b.checkedIn) {
          return -1
        }
        if (a.alias && !b.alias) {
          return -1
        }
        return 0
      })

    loading = false
  }

  function randomNum (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
</script>

<style>
  :global(html) {
    background-color: var(--color-base-0);
    color: var(--color-base-100);
  }

  @media screen {
    :global(body) {
      margin: var(--size-4);
    }
  }

  .header {
    display: flex;
    flex-wrap: wrap;
    gap: 0 var(--size-4);
  }

  .content {
    column-gap: var(--size-6);
    column-rule: var(--border);
    column-width: 24rem;
  }

  table {
    border-collapse: collapse;
  }

  td {
    border-bottom: var(--px-1) solid transparent;
    padding: 0 var(--size-1);
    vertical-align: top;
  }

  tbody tr:nth-child(3n) td {
    border-bottom-color: var(--color-base-100);
  }

  .highlight {
    background-color: var(--color-base-100);
    color: var(--color-base-0);
  }
</style>

<Page
  loading={loading}
  notFound={notFound}
  theme='plain'
  title={title}>
  <div class="header">
    <h1 class="u-ts-2 u-text-bold">{event?.name}</h1>
    <p class="u-lh-2 u-m-0">{event?.displayDate}</p>
    <p class="u-lh-2 u-m-0">{`Returners cutoff: ${returnersCutoff}`}</p>
  </div>
  <div class="content u-m-top-2">
    <table>
      <thead class="u-sr-only">
        <tr>
          <th class="u-text-right">Host count</th>
          <th class="u-text-center">Check in</th>
          <th class="u-text-right">Check-in count</th>
          <th>Participant</th>
          <th class="u-text-right">Last event</th>
        </tr>
      </thead>
      <tbody>
        {#each participants as p}
          <tr>
            <td class="u-text-right">{p.hostCount}</td>
            <td class="u-text-center">
              {#if p.checkedIn && p.checkIn.host}
                H
              {:else if p.checkedIn}
              <span class="u-flex">
                <Icon name="check" />
              </span>
              {/if}
            </td>
            <td
              class="u-text-right"
              class:highlight={p.highlightCheckInCount}>
              {p.checkInCount}
            </td>
            <td class:highlight={p.highlightName}>{p.displayName}</td>
            <td class="u-text-nobr u-text-right">{p.lastEventDate}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</Page>
