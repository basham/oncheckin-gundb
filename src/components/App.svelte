<script>
  export let loading = true
</script>

<style>
  header {
    border-bottom: var(--border);
    padding: var(--size-2);
  }

  main {
    padding: var(--size-4);
  }

  .loading {
    display: none;
  }
</style>

<header>
  <div>OnCheckIn</div>
</header>

<main class:loading={loading}>
  <slot></slot>
</main>
