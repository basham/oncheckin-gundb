<script>
  import { orgStore } from '../stores.js'

  export let loading = false
  export let location = ''
  export let notFound = false
  export let title = ''

  const appName = 'OnCheckIn'
  $: title = notFound ? ['Page not found'] : (Array.isArray(title) ? title : [title])
  $: fullTitle = [...title, appName].filter((v) => v).join(' - ')
  // $: focusOnHeading(loading)

  let orgName = orgStore.get()?.name

  $: nav = [
    ['Home', './'],
    ['Events', '?p=events'],
    ['Participants', '?p=participants'],
    ['Settings', '?p=settings']
  ]
    .map(([label, url]) => {
      const current = location === label.toLowerCase() ? 'location' : null
      return { current, label, url }
    })

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
    border-bottom: var(--px-2) solid var(--color-black);
  }

  nav ul {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-2) var(--size-4);
    list-style-type: '';
    margin: 0;
    padding: 0 var(--size-4);
  }

  nav a {
    color: var(--color-black-2);
    display: inline-block;
    padding: var(--size-3) 0;
    text-decoration: none;
  }

  nav a:hover {
    color: var(--color-ix);
  }

  nav a[aria-current] {
    box-shadow: 0 var(--px-2) 0 0 var(--color-ix);
    color: var(--color-ix);
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
    {#each nav as item}
      <li>
        <a aria-current={item.current} href={item.url}>{item.label}</a>
      </li>
    {/each}
  </ul>
</nav>

<main class:loading={loading}>
  {#if notFound}
    <h1>{title}</h1>
  {:else}
    <slot></slot>
  {/if}
</main>
