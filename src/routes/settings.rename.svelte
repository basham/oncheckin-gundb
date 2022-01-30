<script>
  import { onMount } from 'svelte'
  import { workspaceStore } from '@src/stores.js'
  import Layout from './layout.svelte'

  export let params
  export let route

  const title = 'Rename workspace'

  let loaded = false
  let workspace
  let name

  onMount(async () => {
    workspace = await workspaceStore.get()
    name = workspace?.name
    loaded = true
  })

  async function submit (event) {
    event.preventDefault()
    await workspaceStore.rename(name)
    window.location = '?p=settings'
  }
</script>

<Layout
  loaded={loaded}
  location='settings'
  params={params}
  route={route}
  title={title}>
  <div class="card">
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
  </div>
</Layout>
