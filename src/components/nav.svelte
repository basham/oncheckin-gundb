<script>
  export let location = ''

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
</script>

<style>
  nav {
    border-bottom: var(--px-2) solid var(--color-black);
  }

  nav ul {
    display: flex;
    flex-wrap: wrap;
    font-size: var(--fs-2);
    gap: var(--size-2) var(--size-4);
    list-style-type: '';
    margin: 0;
    padding: 0 var(--size-4);
  }

  nav a {
    color: var(--color-black-2);
    display: inline-block;
    padding: var(--size-4) 0;
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
  <ul>
    {#each nav as item}
      <li>
        <a aria-current={item.current} href={item.url}>{item.label}</a>
      </li>
    {/each}
  </ul>
</nav>
