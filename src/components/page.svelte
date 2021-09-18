<script>
  import { orgStore } from '../stores.js'

  export let loading = false
  export let notFound = false
  export let title = ''

  const appName = 'OnCheckIn'
  $: title = notFound ? ['Page not found'] : (Array.isArray(title) ? title : [title])
  $: fullTitle = [...title, appName].filter((v) => v).join(' - ')
  // $: focusOnHeading(loading)

  let orgName = orgStore.get()?.name

  function focusOnHeading (loading) {
    if (loading) return
    window.requestAnimationFrame(() => {
      const heading = document.querySelector('h1')
      if (!heading) return
      heading.setAttribute('tabindex', '-1')
      heading.focus()
      heading.removeAttribute('tabindex')
    })
  }

  setTimeout(() => focusOnHeading(loading), 100)
</script>

<style>
  header {
    background-color: var(--color-black);
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-2) var(--size-4);
    padding: var(--size-4);
  }

  nav {
    border-bottom: var(--px-1) solid var(--color-black);
  }

  nav ul {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-2) var(--size-4);
    list-style-type: '';
    margin: 0;
    padding: var(--size-4);
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
  <strong>{appName}</strong>
  <span>{orgName}</span>
</header>

<nav>
  <ul>
    <li><a href="./">Home</a></li>
    <li><a href="?p=events">Events</a></li>
    <li><a href="?p=participants">Participants</a></li>
    <li><a href="?p=settings">Settings</a></li>
  </ul>
</nav>

<main class:loading={loading}>
  {#if notFound}
    <h1>{title}</h1>
  {:else}
    <slot></slot>
  {/if}
</main>
