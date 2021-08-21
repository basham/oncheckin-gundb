<script>
  export let loading = true
  export let root = '../'
  export let title = ''

  const appName = 'OnCheckIn'
  $: fullTitle = [title, appName].filter((v) => v).join(' - ')
  const styleHref = `${root}style.css`
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
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href={styleHref}>
</svelte:head>

<header>
  <div>{appName}</div>
</header>

<main class:loading={loading}>
  <slot></slot>
</main>
