<script>
  import { getContext } from 'svelte'
  import Layout from '@src/client/layouts/org.svelte'
  import QRCode from '@src/client/lib/qr-code.svelte'
  import Toast from '@src/client/lib/toast.svelte'

  const title = 'Share workspace'
  const { org, heading } = getContext('data')

  let toast

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

<Layout>
  <h1>{heading}</h1>
  <p class="u-m-top-4">Invite others to collaborate in this organization as editors. (There is no read-only mode.) Either copy and share the invite link, or ask others scan the QR&nbsp;code.</p>
  <div class="card u-m-top-6 u-flex u-flex-wrap u-flex-gap-2">
    <input
      aria-label="Share link"
      class="input share-link-input"
      id="share-link-input"
      readonly
      type="text"
      value={org.shareUrl} />
    <button
      class="button button--primary"
      on:click={copyShareLink}>
      Copy link
    </button>
  </div>
  <div class="card u-m-top-6">
    <QRCode code={org.shareUrl} />
  </div>
  <Toast bind:this={toast} />
</Layout>
