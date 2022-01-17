<script>
  import { onMount } from 'svelte'
  import Page from './page.svelte'
  import { workspaceStore } from '../stores.js'

  const title = 'Settings'

  let loading = true
  let workspace

  onMount(async () => {
    workspace = await workspaceStore.get()
    loading = false
  })
</script>

<Page
  loading={loading}
  location='settings'
  title={title}>
  <h1>{title}</h1>
  <ul class="list-inline">
    <li><a href="?p=workspaces">Change workspace</a></li>
  </ul>
  <div class="group u-m-top-6">
    <h2 class="u-m-top-0">This workspace</h2>
    <p class="u-m-0"><span class="u-color-hint">Name:</span> {workspace?.name}</p>
    <p class="u-m-0"><span class="u-color-hint">ID:</span> {workspace?.id}</p>
    <p class="u-m-0"><span class="u-color-hint">Pub link:</span> {workspace?.pub}</p>
    <ul class="list-inline u-m-bottom-0">
      <li><a href="?p=share">Share</a></li>
      <li><a href="?p=rename-workspace">Rename</a></li>
      <li><a href="?p=edit-pub">Edit pub</a></li>
    </ul>
  </div>
</Page>
