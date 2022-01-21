<script>
  import { onMount } from 'svelte'
  import { workspaceStore } from '../stores.js'
  import Page from './page.svelte'

  const title = 'Edit pub'

  let loading = true
  let workspace
  let pub

  onMount(async () => {
    workspace = await workspaceStore.get()
    pub = workspace?.pub
    loading = false
  })

  async function submit (event) {
    event.preventDefault()
    await workspaceStore.setPub(workspace.id, pub)
    window.location = '?p=settings'
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
      <label for="pub">Pub link</label>
      <br>
      <input
        bind:value={pub}
        class="input"
        id="pub"
        type="text">
    </div>
    <div class="u-m-top-6">
      <button class="button button--primary" type="submit">Save</button>
    </div>
  </form>
</Page>
