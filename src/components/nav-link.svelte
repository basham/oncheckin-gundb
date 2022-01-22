<script>
  export let href
  export let id
  export let location
</script>

<style>
  a {
    display: inline-block;
    font-weight: bold;
    line-height: var(--lh-2);
    padding: var(--size-1) 0;
    text-decoration: none;
  }

  a:focus {
    outline-offset: var(--size-1);
  }

  a[aria-current] {
    box-shadow: 0 var(--px-2) 0 0 currentColor;
  }
</style>

<a
  aria-current={location && id && location === id ? 'page' : null}
  href={href}>
  <slot></slot>
</a>
