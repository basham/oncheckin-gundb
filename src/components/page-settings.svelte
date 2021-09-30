<script>
  import { orgStore } from '../stores.js'
  import Page from './page.svelte'

  const title = 'Settings'

  let loading = true
  let name = ''

  load()

  async function load () {
    name = orgStore.get()?.name
    loading = false
  }

  async function submit (event) {
    event.preventDefault()
    await orgStore.set({ name })
    window.location = './'
  }
</script>

<Page
  loading={loading}
  location='settings'
  title={title}>
  <h1>{title}</h1>
  <form
    autocomplete="off"
    on:submit={submit}>
    <div class="u-m-top-6">
      <label for="name">Organization name</label>
      <br>
      <input
        bind:value={name}
        class="input"
        id="name"
        type="text">
    </div>
    <div class="u-m-top-6">
      <button class="button button--primary" type="submit">Save</button>
    </div>
  </form>
</Page>
