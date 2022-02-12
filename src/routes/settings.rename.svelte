<script>
  import { onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { workspaceStore } from '@src/stores.js'
  import Layout from '@src/layouts/workspace.svelte'

  const title = 'Rename workspace'

  let state = STATE.LOADING
  let workspace
  let name

  onMount(async () => {
    workspace = await workspaceStore.get()
    name = workspace?.name
    state = STATE.LOADED
  })

  async function submit (event) {
    event.preventDefault()
    await workspaceStore.rename(name)
    window.location = '?p=settings'
  }
</script>

<Layout
  state={state}
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
</Layout>
