<script>
  import QRious from 'qrious'
  import { onMount } from 'svelte'
  import Page from './page.svelte'
  import { workspaceStore } from '../stores.js'

  const title = 'Share workspace'
  const workspace = workspaceStore.get()
  const inviteCode = window.btoa(JSON.stringify({
    id: workspace.id,
    pub: workspace.pub
  }))
  const shareLink = `${window.location.origin}/?p=join&code=${inviteCode}`

  onMount(() => {
    new QRious({
      background: '#ffb36a',
      element: document.getElementById('share-code'),
      size: 160,
      value: shareLink
    })
  })

  function copyShareLink () {
    const text = document.getElementById('share-link-input')
    text.select()
    document.execCommand('copy')
  }
</script>

<Page
  location='settings'
  title={title}>
  <h1>{title}</h1>
  <p>Invite others to collaborate in this workspace as editors. (There is no read-only mode.) Either copy and share the invite link, or ask others scan the QR&nbsp;code.</p>
  <div>
    <input
      aria-label="Share link"
      class="input"
      id="share-link-input"
      readonly
      type="text"
      value={shareLink} />
  </div>
  <div class="u-m-top-6">
    <button
      class="button button--primary"
      on:click={copyShareLink}>
      Copy share link
    </button>
  </div>
  <div class="u-m-top-6">
    <canvas id="share-code"></canvas>
  </div>
</Page>
