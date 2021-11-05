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
      background: '#ff8c00',
      element: document.getElementById('inviteQrCode'),
      size: 160,
      value: inviteLink
    })
  })
</script>

<style>
  main {
    margin: 0 auto;
    max-width: 30rem;
  }

  .logo {
    align-items: center;
    color: var(--color-base-30);
    display: flex;
    font-size: var(--fs-4);
    gap: var(--size-3);
    margin: var(--size-4) 0;
  }

  .logo img {
    --size: 3rem;
    height: var(--size);
    width: var(--size);
  }
</style>

<Page theme='plain'>
  <main>
    <div class="logo">
      <img
        alt=""
        class="logo"
        src="../icon.svg">
      <span>OnCheckIn</span>
    </div>

    <h1>Get started</h1>
    <p>OnCheckIn is a tool for managing participants and events for Hash&nbsp;House&nbsp;Harrier kennels. There is no global database. Instead, data is organized into indepenent workspaces, in which you manage and control.</p>
    <p><a href="#">Join a workspace</a></p>
    <p><a href="#">Create a new workspace</a></p>

    <h1>Join workspace</h1>
    <p>Join a workspace with an invite code, invite link, or by scanning a QR&nbsp;code on someone else's device.</p>
    <div class="u-m-top-6">
      <label for="inviteCodeInput">Invite code</label><br>
      <textarea
        class="input"
        id="inviteCodeInput">
      </textarea>
    </div>
    <div class="u-m-top-6">
      <button
        class="button button--primary"
        type="submit">
        Join workspace
      </button>
    </div>

    <h1>New workspace</h1>
    <p>Workspaces initially exist only on the devices on which they were created. No network connectivity is needed, as all functionality works offline. However, to collaborate or to backup data, it must sync with a server, called a pub.</p>
    <p>Pubs can host any number of workspaces, and workspaces can be synced with any number of pubs. Pubs are easy to spin up and free to run. Learn how to <a href="#">start your pub</a>.</p>
    <p><a href="#">Join a workspace</a></p>
    <p><a href="#">Create a new workspace</a></p>

    <h1>Invite</h1>
    <p>Invite others to collaborate in this workspace.</p>
    <h2>Invite QR code</h2>
    <canvas id="inviteQrCode"></canvas>
    <h2>Invite link</h2>
    <div class="u-m-top-6">
      <label for="inviteLinkInput">Invite code</label><br>
      <textarea
        class="input"
        id="inviteLinkInput"
        readonly
        value={inviteLink} />
    </div>
    <div class="u-m-top-6">
      <button class="button button--primary">
        Copy
      </button>
    </div>

    <h1>Workspaces</h1>
    <p>
      <a href="#">Blooming Fools</a><br>
      <span>ID: cjld2cjxh0000qzrmn831i7rn</span><br>
      <span>Created: Nov 1, 2021</span>
    </p>
  </main>
</Page>
