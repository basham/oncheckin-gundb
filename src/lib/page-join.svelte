<script>
  import Page from './page.svelte'
  import { workspaceStore } from '../stores.js'

  const params = (new URL(document.location)).searchParams
  const inviteCode = params.get('code')
  const { id, name, pub } = JSON.parse(window.atob(inviteCode))

  async function joinWorkspace () {
    await workspaceStore.setPub(id, pub)
    const workspace = await workspaceStore.get(id)
    window.location = workspace.openUrl
  }
</script>

<Page
  theme="app"
  title="Join workspace">
  <div class="group u-m-top-6">
    <h2 class="u-m-top-0">{name}</h2>
    <p class="u-m-0"><span class="u-color-hint">ID:</span> {id}</p>
    <p class="u-m-0"><span class="u-color-hint">Pub:</span> {pub}</p>
  </div>
  <div class="u-m-top-6">
    <button
      class="button button--primary"
      on:click={joinWorkspace}>
      Join workspace
    </button>
  </div>
</Page>
