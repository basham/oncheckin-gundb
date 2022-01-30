<script>
  import { onMount } from 'svelte'
  import { workspaceStore } from '@src/stores.js'
  import Layout from '@src/layouts/workspace.svelte'

  const title = 'Edit pub'

  let loaded = false
  let workspace
  let pub

  onMount(async () => {
    workspace = await workspaceStore.get()
    pub = workspace?.pub
    loaded = true
  })

  async function submit (event) {
    event.preventDefault()
    await workspaceStore.setPub(workspace.id, pub)
    window.location = '?p=settings'
  }
</script>

<Layout
  loaded={loaded}
  title={title}>
  <div class="card">
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
  </div>
</Layout>
