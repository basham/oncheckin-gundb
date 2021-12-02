<script>
  import { workspaceStore } from '../stores.js'
  import Page from './page.svelte'

  let name = ''
  let pub = ''

  async function submit (e) {
    e.preventDefault()
    const workspace = await workspaceStore.create({ name, pub })
    window.location = workspace.confirmationUrl
  }
</script>

<Page
  theme="app"
  title="New workspace">
  <p>OnCheckIn does not sync with a global database. Instead, you control your own data with workspaces and pubs.</p>
  <p>A workspace initially exists only on the device on which it is created. It works offline, but it must sync with a pub to back up data or collaborate.</p>
  <details>
    <summary>Start a pub</summary>
    <p>A quick and free way to start a pub is with <a href="https://glitch.com/">Glitch</a>.</p>
    <ol>
      <li>Create or log in to your Glitch account.</li>
      <li><a href="https://glitch.com/edit/#!/remix/oncheckin-pub">Remix the OnCheckIn Pub</a>.</li>
      <li>Click on the Share button at the top.</li>
      <li>Copy the link to the live site.</li>
      <li>Enter this link as the <a href="#pubLinkInput">Pub link</a>.</li>
    </ol>
    <p>Explore <a href="https://github.com/earthstar-project/earthstar-pub">Earthstar Pub</a> for additional ways to start a pub.</p>
    <p>Feel free to reuse pubs, since each can host multiple workspaces.</p>
  </details>
  <form
    autocomplete="off"
    on:submit={submit}>
    <div class="u-m-top-6">
      <label for="workspaceNameInput">Workspace name (optional)</label>
      <br>
      <input
        bind:value={name}
        class="input"
        id="workspaceNameInput"
        type="text">
    </div>
    <div class="u-m-top-6">
      <label for="pubLinkInput">Pub link (optional)</label>
      <br>
      <input
        bind:value={pub}
        class="input"
        id="pubLinkInput"
        type="text">
    </div>
    <div class="u-m-top-6">
      <button
        class="button button--primary"
        type="submit">
        Create workspace
      </button>
    </div>
  </form>
</Page>
