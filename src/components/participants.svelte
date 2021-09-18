<script>
  export let participants = []
</script>

<style>
  ul {
    display: flex;
    flex-direction: column;
    gap: var(--size-2);
    margin: 0 0 0 var(--size-4);
    padding: 0;
  }
</style>

<ul>
  {#each participants as p}
    <li><a href={p.url}>{p.fullName}</a></li>
  {/each}
</ul>
