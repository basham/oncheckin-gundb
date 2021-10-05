<script>
  export let events = []
</script>

<style>
  ul {
    display: flex;
    flex-direction: column;
    gap: var(--size-3);
    margin: 0 0 0 var(--size-4);
    padding: 0;
  }

  .date {
    display: inline-block;
    min-width: 12ch;
  }
</style>


<ul>
  {#each events as event}
    <li>
      <span class="date">{event.displayDate}</span>
      <a href={event.url}>{event.name}</a>
    </li>
  {/each}
</ul>

