<script>
  import { getContext, onMount } from 'svelte'
  import { STATE } from '@src/constants.js'
  import { workspaceStore } from '@src/client/stores.js'
  import Layout from '@src/client/layouts/org.svelte'

  const title = 'Rename workspace'
  const { docId } = getContext('params')

  let state = STATE.LOADING
  let workspace
  let name

  onMount(async () => {
    workspace = await workspaceStore.get(docId)
    name = workspace?.name
    state = STATE.LOADED
  })

  async function submit (event) {
    event.preventDefault()
    await workspaceStore.rename(docId, name)
    window.location = `?p=${docId}/settings`
  }
</script>

<Layout
  state={state}
  title={title}>
  <h1>{title}</h1>
  <form
    autocomplete="off"
    on:submit={submit}>
    <div class="u-m-top-4">
      <label for="name">Workspace name</label>
      <br>
      <input
        bind:value={name}
        class="input"
        id="name"
        type="text">
    </div>
    <div class="u-m-top-4">
      <button class="button button--primary" type="submit">Save</button>
    </div>
  </form>
</Layout>
