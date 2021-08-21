<script>
  import { gun } from '../../gun.js'
  import App from '../../components/App.svelte'

  let title = 'New event'
  let loading = true
  let orgName = ''
  let name = ''

  gun.get('org').once((data) => {
    if (data) {
      orgName = data.name
    }
    loading = false
  })

  function submit (event) {
    event.preventDefault()
    gun.get('org').get('events').put({ name })
    window.location = '../../'
  }
</script>

<App
  depth={2}
  loading={loading}
  title={title}>
  <nav>
    <ol>
      <li><a href="../../">{orgName}</a></li>
      <li aria-current="page">{title}</li>
    </ol>
  </nav>
  <h1>{title}</h1>
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
