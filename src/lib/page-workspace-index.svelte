<script>
  import { onMount } from 'svelte'
  import { workspaceStore } from '../stores.js'
  import Page from './page.svelte'

  let loading = true
  let workspaces = []

  onMount(async () => {
    workspaces = await workspaceStore.getAll()
    loading = false
  })
</script>

<Page
  loading={loading}
  theme="app"
  title="Workspaces">
  <ul class="list-inline u-m-top-2">
    <li><a href="?p=new-workspace">New workspace</a></li>
  </ul>
  <details class="u-m-top-6">
    <summary>Join a workspace</summary>
    <p>To join an existing workspace, you need an invite link from someone who has access to that workspace.</p>
  </details>
  {#each workspaces as workspace}
    <h2 class="u-m-bottom-0">
      <a
        class="u-ts-2"
        href={workspace.openUrl}>
        {workspace.name}
      </a>
    </h2>
    <p class="u-m-top-0">ID: {workspace.id}</p>
  {/each}
</Page>
