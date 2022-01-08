<script>
  import Page from './page.svelte'
  import { workspaceStore } from '../stores.js'

  const title = 'Settings'

  const workspace = workspaceStore.get()
</script>

<Page
  location='settings'
  title={title}>
  <h1>{title}</h1>
  <h2>This workspace</h2>
  <p><a href="?p=rename-workspace">Rename workspace</a></p>
  <p><a href="?p=edit-pub">Edit pub</a></p>
  <p><a href="?p=share">Share workspace</a></p>
  <h2>Other settings</h2>
  <p><a href="?p=workspaces">Change workspace</a></p>
</Page>
