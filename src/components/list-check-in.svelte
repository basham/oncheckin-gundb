<script>
  import { pluralize } from '../util.js'
  export let checkIns = []
</script>

{#if checkIns.length}
  <ul class="link-list">
    {#each checkIns as checkIn}
      <li>
        <a class="link-row" href={checkIn.url}>
          <span class="link-row__primary">{checkIn.participant.displayName}</span>
          <span class="link-row__secondary">
            {#if checkIn.host}
              <span>{`${checkIn.hostCount} ${pluralize(checkIn.hostCount, 'hare')}`}</span>
              <span>&middot;</span>
            {/if}
            <span>{`${checkIn.checkInCount} ${pluralize(checkIn.checkInCount, 'run')}`}</span>
          </span>
        </a>
      </li>
    {/each}
  </ul>
{/if}
