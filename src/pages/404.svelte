<script>
  import { getContext } from 'svelte'
  import Layout from './page.svelte'

  const { h1 } = getContext('data')
</script>

<Layout>
  <main class="u-p-8">
    <h1>{h1}</h1>
  </main>
</Layout>
