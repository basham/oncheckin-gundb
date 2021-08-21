<script>
  import { gun } from './gun.js'
  import App from './components/App.svelte'

  let loading = true
  let name = ''

  gun.get('org').once((data) => {
    if (data) {
      name = data.name
    }
    loading = false
  })
</script>

<style>

</style>

<App loading={loading}>
  {#if name}
    <h1>{name}</h1>
  {:else}
    <h1><em>Organization</em></h1>
  {/if}
  <p>
    <a href="./edit/">Edit</a>
  </p>
</App>
