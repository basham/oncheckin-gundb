<script>
  import { pluralize } from '../util.js'

  export let checkIns = []
  export let showCheckInCount = false
  export let showHostCount = false
</script>

{#if checkIns.length}
  <ul class="list-plain u-gap-2px">
    {#each checkIns as checkIn}
      <li class="row">
        <a class="row__left" href={checkIn.url}>
          <span class="row__primary">{checkIn.participant.displayName}</span>
          <span class="row__secondary">{checkIn.participant.fullName}</span>
          <span class="row__tertiary u-text-num">
            {#if showHostCount && checkIn.host}
              <span>{`${checkIn.hostCount || '?'} ${pluralize(checkIn.hostCount, 'hare')}${showCheckInCount ? ',' : ''}`}</span>
            {/if}
            {#if showCheckInCount}
              <span>{`${checkIn.count || '?'} ${pluralize(checkIn.count, 'run')}`}</span>
            {/if}
          </span>
        </a>
      </li>
    {/each}
  </ul>
{/if}
