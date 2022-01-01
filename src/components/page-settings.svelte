<script>
  import { workspaceStore } from '../stores.js'
  import Page from './page.svelte'

  const title = 'Rename workspace'

  const workspace = workspaceStore.get()
  let name = workspace?.name

  async function submit (event) {
    event.preventDefault()
    await workspaceStore.rename(name)
    window.location = '?p=settings'
  }
</script>

<Page
  location='settings'
  title={title}>
  <h1>{title}</h1>
  <form
    autocomplete="off"
    on:submit={submit}>
    <div class="u-m-top-6">
      <label for="name">Workspace name</label>
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
