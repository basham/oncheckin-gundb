<script>
  import cuid from 'cuid'
  import QRious from 'qrious'
  import { onMount } from 'svelte'
  import Page from './page.svelte'

  let workspaceName = ''
  let pubLink = ''

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
    <p>OnCheckIn is a tool for managing participants and events for Hash&nbsp;House&nbsp;Harrier kennels.</p>
    <p>Join an existing workspace with an invite link or by scanning a QR&nbsp;code on someone else's device.</p>
    <p><a href="#">Create a new workspace</a></p>

    <h1 class="u-m-top-6">New workspace</h1>
    <p>OnCheckIn does not sync with a central database. Instead, you control your own data with workspaces and pubs.</p>
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
    <div class="u-m-top-6">
      <label for="workspaceNameInput">Workspace name (required)</label>
      <br>
      <input
        bind:value={workspaceName}
        class="input"
        id="workspaceNameInput"
        type="text">
    </div>
    <div class="u-m-top-6">
      <label for="pubLinkInput">Pub link (optional)</label>
      <br>
      <input
        bind:value={pubLink}
        class="input"
        id="pubLinkInput"
        type="text">
    </div>
    <div class="u-m-top-6">
      <button class="button button--primary">
        Create workspace
      </button>
    </div>

    <h1 class="u-m-top-6">Workspace created</h1>
    <div class="group u-m-top-6">
      <h2 class="u-m-top-0">Blooming Fools</h2>
      <p class="u-m-0"><span class="u-color-hint">ID:</span> {cuid()}</p>
      <p class="u-m-0"><span class="u-color-hint">Pub:</span> https://oncheckin-pub.glitch.me/</p>
    </div>
    <details class="u-m-top-6">
      <summary>You should save this workspace's invite link</summary>
      <p>Now that the workspace is created, you should copy its invite link and save it in a safe place, like a password manager. This way, you can reopen this workspace in case the browser's data is cleared.</p>
      <div class="u-m-top-4">
        <button class="button">
          Copy invite link
        </button>
      </div>
    </details>
    <div class="u-m-top-6">
      <button class="button button--primary">
        Open workspace
      </button>
    </div>

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

    <h1 class="u-m-top-6">Workspaces</h1>
    <p>
      <a href="#" class="u-ts-2">Blooming Fools</a><br>
      <span>ID: cjld2cjxh0000qzrmn831i7rn</span><br>
      <span>Created: Nov 1, 2021</span>
    </p>
  </main>
</Page>
