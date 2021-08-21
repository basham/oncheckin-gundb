<script>
  export let href = ''
  export let isCurrent = false
</script>

<style>
  li {
    flex-shrink: 0;
  }

  li:not(:last-child)::after {
    content: '/';
    padding: 0 var(--size-2);
  }
</style>

{#if isCurrent}
  <li aria-current="page">
    <slot></slot>
  </li>
{:else}
  <li>
    <a href={href}>
      <slot></slot>
    </a>
  </li>
{/if}
