<script>
  export let location = ''

  $: nav = [
    ['Home', './'],
    ['Events', '?p=events'],
    ['Participants', '?p=participants'],
    ['Settings', '?p=settings'],
    ['Workspaces', '?p=workspaces']
  ]
    .map(([label, url]) => {
      const current = location === label.toLowerCase() ? 'location' : null
      return { current, label, url }
    })
</script>

<style>
  nav {
    background-color: var(--color-base-100);
    border-bottom: var(--px-2) solid var(--color-base-75);
  }

  nav ul {
    padding: 0 var(--size-4);
  }

  nav a {
    color: var(--color-base-50);
    display: inline-block;
    padding: var(--size-2) 0;
    text-decoration: none;
  }

  nav a:hover {
    color: var(--color-ix);
  }

  nav a:focus {
    outline-offset: var(--size-1);
  }

  nav a[aria-current] {
    box-shadow: 0 var(--px-2) 0 0 var(--color-ix);
    color: var(--color-ix);
  }
</style>

<nav>
  <ul class="list-inline u-m-0 u-ts-2">
    {#each nav as item}
      <li>
        <a aria-current={item.current} href={item.url}>{item.label}</a>
      </li>
    {/each}
  </ul>
</nav>
