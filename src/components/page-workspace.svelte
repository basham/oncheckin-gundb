<script>
  import cuid from 'cuid'
  import QRious from 'qrious'
  import { onMount } from 'svelte'
  import Page from './page.svelte'

  const inviteCode = window.btoa(JSON.stringify({
    id: cuid(),
    pub: 'https://oncheckin-pub.glitch.me/'
  }))
  const inviteLink = `${window.location.origin}/?p=join&code=${inviteCode}`

  onMount(() => {
    new QRious({
      background: '#ffb36a',
      element: document.getElementById('inviteQrCode'),
      size: 160,
      value: inviteLink
    })
  })
</script>

<Page theme='app'>
  <div>
    <h1 class="u-m-top-6">Join workspace</h1>
    <div class="group u-m-top-6">
      <h2 class="u-m-top-0">Blooming Fools</h2>
      <p class="u-m-0"><span class="u-color-hint">ID:</span> {cuid()}</p>
      <p class="u-m-0"><span class="u-color-hint">Pub:</span> https://oncheckin-pub.glitch.me/</p>
    </div>
    <div class="u-m-top-6">
      <button class="button button--primary">
        Join workspace
      </button>
    </div>
    <h2>You already joined this workspace</h2>
    <div class="u-m-top-6">
      <button class="button button--primary">
        Open workspace
      </button>
    </div>

    <h1 class="u-m-top-6">Invite</h1>
    <p>Invite others to collaborate in this workspace as editors. (There is no read only mode.) Either copy and share the invite link, or ask others scan the QR&nbsp;code.</p>
    <div class="u-m-top-6">
      <button class="button button--primary">
        Copy invite link
      </button>
    </div>
    <div class="u-m-top-6">
      <canvas id="inviteQrCode"></canvas>
    </div>
  </div>
</Page>
