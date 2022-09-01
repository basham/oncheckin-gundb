<script>
  import { getContext } from 'svelte'
  import Icon from '@src/lib/icon.svelte'
  import Layout from '@src/pages/page.svelte'

  const { event, returnersCutoff, participants } = getContext('data')

  /*
  onMount(async () => {
    event = await eventStore.get(docId, eventId)

    if (!event) {
      state = STATE.NOT_FOUND
      return
    }

    title = `Roster: ${event?.name} (${event?.displayDate})`

    const lastEventCutoffDate = sub(event?.dateObj, { months: 12 })
    const returnersCutoffDate = sub(event?.dateObj, { months: 2 })
    returnersCutoff = format(returnersCutoffDate, 'MM/dd')

    // Cache participants and events, to optimize the following queries.
    const allParticipants = await participantStore.getAll(docId)
    await eventStore.getAll(docId)

    const checkIns = (await checkInStore.getEventCheckIns(docId, eventId))
      .map((checkIn) => [checkIn.participant.id, checkIn])
    const checkInsMap = new Map(checkIns)
    const participantsPromises = allParticipants
      .map(async (p) => {
        const checkIn = checkInsMap.get(p.id)
        const checkedIn = !!checkIn
        const participantCheckIns = (await checkInStore.getParticipantCheckIns(docId, p.id))
          .filter((checkIn) => isBefore(checkIn.event.dateObj, event.dateObj))
        const lastCheckIn = participantCheckIns[0]
        const lastEvent = lastCheckIn?.event
        const lastEventDate = lastEvent ? format(lastEvent.dateObj, 'MM/dd/yy') : ''
        const highlightLastEventDate = lastEvent && isBefore(lastEvent.dateObj, returnersCutoffDate)
        const lastEventCutoff = lastEvent && isBefore(lastEvent.dateObj, lastEventCutoffDate)
        const displayName = p.alias ? p.displayName : `${p.displayName} (${p.lastName})`
        return {
          ...p,
          checkIn,
          checkedIn,
          displayName,
          highlightLastEventDate,
          latestCheckIn: checkIn || lastCheckIn,
          lastCheckIn,
          lastEventCutoff,
          lastEventDate
        }
      })
    participants = (await Promise.all(participantsPromises))
      .filter(({ lastCheckIn, lastEventCutoff }) => lastCheckIn && !lastEventCutoff)
      .sort((a, b) => {
        if (a.checkIn?.host && !b.checkIn?.host) {
          return -1
        }
        if (!a.checkIn?.host && b.checkIn?.host) {
          return 1
        }
        if (a.checkedIn && !b.checkedIn) {
          return -1
        }
        if (!a.checkedIn && b.checkedIn) {
          return 1
        }
        if (a.alias && !b.alias) {
          return -1
        }
        if (!a.alias && b.alias) {
          return 1
        }
        return 0
      })

    state = STATE.LOADED
  })
  */
</script>

<style>
  :global(html) {
    background-color: var(--color-base-0);
    color: var(--color-base-100);
    font-size: var(--fs-0);
    line-height: var(--lh-0);
  }

  @media screen {
    :global(body) {
      margin: var(--size-4);
    }
  }

  .content {
    column-gap: var(--size-6);
    column-width: 25rem;
  }

  table {
    border-collapse: collapse;
  }

  th {
    border-bottom: var(--px-1) solid currentColor;
    padding: 0 var(--size-1) var(--px-2);
    position: relative;
    height: 5rem;
    vertical-align: bottom;
    white-space: nowrap;
  }

  th > div {
    bottom: var(--size-1);
    left: 0;
    position: absolute;
    transform: translate(var(--translate), 0) rotate(-90deg);
    transform-origin: 0% 100%;
    width: 100%;
  }

  th > div.center {
    --translate: calc(50% + var(--lh-1) / 2);
  }

  th > div.right {
    --translate: 100%;
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

<Layout>
  <div class="header">
    <h1 class="u-ts-2 u-text-bold">{event.name}</h1>
    <p class="u-m-0">{event.displayDateLong}</p>
  </div>
  <div class="content u-m-top-2">
    <table>
      <thead>
        <tr>
          <th><div class="center">Check in</div></th>
          <th><div class="right">Hares</div></th>
          <th><div class="right">Runs</div></th>
          <th class="u-text-left">Hasher</th>
          <th class="u-text-left">
            Last run<br>
            <span class="u-text-normal">{`Ret. ${returnersCutoff}`}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {#each participants as p}
          <tr>
            <td class="u-text-center">
              {#if p.checkedIn && p.checkIn.host}
                <span aria-hidden="true">H</span>
                <span class="u-sr-only">Hare</span>
              {:else if p.checkedIn}
              <span class="u-flex">
                <Icon name="check" />
                <span class="u-sr-only">Checked in</span>
              </span>
              {/if}
            </td>
            <td class="u-text-num u-text-right">{p.latestCheckIn.hostCount > 0 ? p.latestCheckIn.hostCount : ''}</td>
            <td
              class="u-text-num u-text-right"
              class:highlight={p.latestCheckIn.specialCount}>
              {p.latestCheckIn.count}
            </td>
            <td class:highlight={p.latestCheckIn.readyForNaming}>{p.displayName}</td>
            <td
              class="u-text-num"
              class:highlight={p.highlightLastEventDate}>
              {p.lastEventDate}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</Layout>
