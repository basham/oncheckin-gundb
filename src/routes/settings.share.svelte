<script>
  import { onMount } from 'svelte'
  import { workspaceStore } from '@src/stores.js'
  import Layout from '@src/layouts/workspace.svelte'
  import QRCode from '@src/lib/qr-code.svelte'
  import Toast from '@src/lib/toast.svelte'

  const title = 'Share workspace'

  let loaded = false
  let workspace
  let toast

  onMount(async () => {
    workspace = await workspaceStore.get()
    loaded = true
  })

  function copyShareLink (event) {
    const text = document.getElementById('share-link-input')
    text.select()
    document.execCommand('copy')
    event.target.focus()
    toast.dispatch('Copied share link')
  }
</script>

<style>
  .share-link-input {
    flex-basis: 10rem;
    flex-grow: 1;
    max-width: none;
  }
</style>

<Layout
  loaded={loaded}
  location='settings'
  title={title}>
  <div class="card">
    <h1>{title}</h1>
    <p class="u-m-top-4">Invite others to collaborate in this workspace as editors. (There is no read-only mode.) Either copy and share the invite link, or ask others scan the QR&nbsp;code.</p>
    <div class="u-m-top-6 u-flex u-flex-wrap u-flex-gap-2">
      <input
        aria-label="Share link"
        class="input share-link-input"
        id="share-link-input"
        readonly
        type="text"
        value={workspace?.shareUrl} />
      <button
        class="button button--primary"
        on:click={copyShareLink}>
        Copy link
      </button>
    </div>
    <div class="u-m-top-6">
      <QRCode code={workspace?.shareUrl} />
    </div>
  </div>
  <Toast bind:this={toast} />
</Layout>
