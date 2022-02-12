<script>
  import { pluralize } from '../util.js'

  export let checkIns = []
  export let showCheckInCount = false
  export let showHostCount = false
</script>

{#if checkIns.length}
  <ul class="link-list">
    {#each checkIns as checkIn}
      <li>
        <a class="link-item" href={checkIn.url}>
          <span class="link-item__primary">{checkIn.participant.displayName}</span>
          <span class="link-item__secondary u-text-num">
            {#if showHostCount && checkIn.host}
              <span>{`${checkIn.hostCount || '?'} ${pluralize(checkIn.hostCount, 'hare')}`}</span>
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
