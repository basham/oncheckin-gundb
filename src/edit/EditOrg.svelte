<script>
  import { gun } from '../gun.js'
  import App from '../components/App.svelte'

  let loading = true
  let name = ''

  gun.get('org').once((data) => {
    if (data) {
      name = data.name
    }
    loading = false
  })

  function submit (event) {
    event.preventDefault()
    gun.get('org').put({ name })
    window.location = '../'
  }
</script>

<App loading={loading}>
  <p>
    <a href="../">Cancel</a>
  </p>
  <h1>Edit organization</h1>
  <form
    autocomplete="off"
    on:submit={submit}>
    <div class="u-m-top-4">
      <label for="name">Name</label>
      <input
        bind:value={name}
        id="name"
        type="text">
    </div>
    <div class="u-m-top-4">
      <button type="submit">Save</button>
    </div>
  </form>
</App>
