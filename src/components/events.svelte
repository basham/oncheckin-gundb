<script>
  export let events = []
</script>

{#if events.length}
  <ul class="link-list">
    {#each events as event}
      <li>
        <a class="link-row" href={event.url}>
          <div class="link-row__primary">{event.name}</div>
          <div class="link-row__secondary">{event.displayDateMedium}</div>
        </a>
      </li>
    {/each}
  </ul>
{/if}
