<script>
  import QRious from 'qrious'
  import { onMount } from 'svelte'
  import Page from './page.svelte'
  import Toast from './toast.svelte'
  import { workspaceStore } from '../stores.js'

  const title = 'Share workspace'
  const workspace = workspaceStore.get()
  const inviteCode = window.btoa(JSON.stringify({
    id: workspace.id,
    pub: workspace.pub
  }))
  const shareLink = `${window.location.origin}/?p=join&code=${inviteCode}`

  let toast

  onMount(() => {
    new QRious({
      background: '#ffb36a',
      element: document.getElementById('share-code'),
      size: 160,
      value: shareLink
    })
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
  .content {
    max-width: 40rem;
  }

  .share-link-input {
    flex-basis: 10rem;
    flex-grow: 1;
    max-width: none;
  }
</style>

<Page
  location='settings'
  title={title}>
  <h1>{title}</h1>
  <p class="content">Invite others to collaborate in this workspace as editors. (There is no read-only mode.) Either copy and share the invite link, or ask others scan the QR&nbsp;code.</p>
  <div class="content u-flex u-flex-wrap u-flex-gap-2">
    <input
      aria-label="Share link"
      class="input share-link-input"
      id="share-link-input"
      readonly
      type="text"
      value={shareLink} />
    <button
      class="button button--primary"
      on:click={copyShareLink}>
      Copy link
    </button>
  </div>
  <div class="u-m-top-6">
    <canvas id="share-code"></canvas>
  </div>
  <Toast bind:this={toast} />
</Page>
