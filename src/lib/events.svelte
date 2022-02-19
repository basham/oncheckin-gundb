<script>
  export let events = []
</script>

{#if events.length}
  <ul class="link-list u-m-top-2">
    {#each events as event}
      <li>
        <a class="link-item" href={event.url}>
          <span class="link-item__primary">{event.name}</span>
          <span class="link-item__secondary u-text-num">{`#${event.count}: ${event.displayDateMedium}`}</span>
        </a>
      </li>
    {/each}
  </ul>
{/if}
