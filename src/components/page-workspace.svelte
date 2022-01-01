<script>
  import cuid from 'cuid'
  import Page from './page.svelte'
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
  </div>
</Page>
