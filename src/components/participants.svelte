<script>
  export let participants = []
</script>

<style>
  ul {
    display: flex;
    flex-direction: column;
    gap: var(--size-2);
    margin: 0 0 0 var(--size-4);
  }
</style>

<ul class="u-p-0">
  {#each participants as p}
    <li><a href={p.url}>{p.displayName}</a></li>
  {/each}
</ul>
