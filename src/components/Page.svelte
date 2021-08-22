<script>
  export let loading = false
  export let title = ''

  const appName = 'OnCheckIn'
  $: fullTitle = [title, appName].filter((v) => v).join(' - ')
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

<svelte:head>
  <title>{fullTitle}</title>
</svelte:head>

<header>
  <div>{appName}</div>
</header>

<main class:loading={loading}>
  <slot></slot>
</main>
