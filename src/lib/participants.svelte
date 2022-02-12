<script>
  export let participants = []
</script>

<ul class="link-list u-m-top-2">
  {#each participants as p}
    <li>
      <a class="link-item" href={p.url}>
        <span class="link-item__primary">{p.displayName}</span>
        <span class="link-item__secondary">{p.fullName}</span>
      </a>
    </li>
  {/each}
</ul>
