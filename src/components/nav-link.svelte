<script>
  export let href
  export let id
  export let location
</script>

<style>
  a {
    color: var(--color-base-50);
    display: inline-block;
    font-weight: bold;
    padding: var(--size-1) 0;
    text-decoration: none;
  }

  a:hover {
    color: var(--color-ix);
  }

  a:focus {
    outline-offset: var(--size-1);
  }

  a[aria-current] {
    box-shadow: 0 var(--px-2) 0 0 var(--color-ix);
    color: var(--color-ix);
  }
</style>

<a
  aria-current={location && id && location === id ? 'page' : null}
  href={href}>
  <slot></slot>
</a>
