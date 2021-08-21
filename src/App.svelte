<script>
  import { gun } from './gun.js'

  let catName = ''
  let store = {}

  gun.get('cats').map().on((data, key) => {
    if (data) {
      store[key] = data
    } else {
      delete store[key]
      store = store
    }
  })
  $: cats = Object.entries(store)

  function submit (event) {
    event.preventDefault()
    gun.get('cats').set({ name: catName })
    catName = ''
  }
</script>

<style>
  :root {
    --color-black-1: #ccc;
    --px-1: calc(1rem/16);
    --size-1: 0.25rem;
    --size-2: 0.5rem;
    --border: var(--px-1) solid var(--color-black-1);
  }

  :global(body) {
    font-family: system, sans-serif;
    margin: 0;
  }

  header {
    border-bottom: var(--border);
    padding: var(--size-2);
  }
</style>

<header>
  <div>OnCheckIn</div>
</header>

<main>
  <h1>OnCheckIn</h1>
  {#each cats as [key, cat]}
    <div key={key} id={key}>{cat.name}</div>
  {/each}
  <form on:submit={submit}>
    <input bind:value={catName} />
    <button type="submit">Save</button>
  </form>
</main>
