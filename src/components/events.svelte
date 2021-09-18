<script>
  export let events = []
</script>

<style>
  ol {
    display: flex;
    flex-direction: column;
    gap: var(--size-3);
    list-style-type: '';
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .date {
    display: inline-block;
    color: var(--color-black-1);
    min-width: 12ch;
  }

  .name {
    _font-size: var(--fs-2);
  }
</style>


<ol>
  {#each events as event}
    <li>
      <span class="date">{event.displayDate}</span>
      <a href={`?p=event&id=${event.id}`}>
        <span class="name">{event.name}</span>
      </a>
    </li>
  {/each}
</ol>

