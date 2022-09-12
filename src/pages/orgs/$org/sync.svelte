<script>
  import { org } from '@src/data.js'
  import Layout from '@src/pages/layout.svelte'

  document.addEventListener('doc-synced', (event) => {
    if (event.detail.id === org.id) {
      window.location = org.url
    }
  })
</script>

<Layout>
  <p class="u-m-top-4">Please wait while the organization syncs and opens.</p>
</Layout>
