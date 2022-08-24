<script>
  import { workspaceStore } from '@src/ui/stores.js'
  import Layout from '@src/ui/layouts/public.svelte'

  let name = ''

  async function submit (e) {
    e.preventDefault()
    const { id, save } = await workspaceStore.create({ name })
    await save()
    window.location = `?p=${id}/events`
  }
</script>

<Layout title="New workspace">
  <form
    autocomplete="off"
    on:submit={submit}>
    <div class="u-m-top-6">
      <label for="workspaceNameInput">Workspace name</label>
      <br>
      <input
        bind:value={name}
        class="input"
        id="workspaceNameInput"
        type="text">
    </div>
    <div class="u-m-top-6">
      <button
        class="button button--primary"
        type="submit">
        Create workspace
      </button>
    </div>
    <div class="u-m-top-6">
      <a href="?p=workspaces">Back to workspaces</a>
    </div>
  </form>
</Layout>
