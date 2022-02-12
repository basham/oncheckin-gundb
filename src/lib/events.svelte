<script>
  export let events = []
</script>

{#if events.length}
  <ul class="link-list u-m-top-2">
    {#each events as event}
      <li>
        <a class="link-item" href={event.url}>
          <div class="link-item__primary"><strong>{`#${event.count}:`}</strong> {event.name}</div>
          <div class="link-item__secondary">{event.displayDateMedium}</div>
        </a>
      </li>
    {/each}
  </ul>
{/if}
