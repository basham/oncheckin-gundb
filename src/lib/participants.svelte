<script>
  export let participants = []
</script>

<ul class="link-list u-m-top-2">
  {#each participants as p}
    <li>
      <a class="link-row" href={p.url}>
        <span class="link-row__primary">{p.displayName}</span>
        <span class="link-row__secondary">{p.fullName}</span>
      </a>
    </li>
  {/each}
</ul>
