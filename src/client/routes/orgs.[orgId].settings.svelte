<script>
  import { getContext } from 'svelte'
  import Layout from '@src/client/layouts/org.svelte'

  const { heading, org } = getContext('data')
</script>

<Layout>
  <h1>{heading}</h1>
  <p class="u-m-top-4">
    <a href="/orgs/">Back to organizations</a>
  </p>
  <h2>This organization</h2>
  <div class="card u-m-top-2">
    <p><span class="u-color-hint">Name:</span> {org.name}</p>
    <p><span class="u-color-hint">ID:</span> {org.id}</p>
    <ul class="list-plain list-plain--inline u-gap-4 u-m-top-4">
      <li><a href={`${org.url}share/`}>Share</a></li>
      <li><a href={`${org.url}rename/`}>Rename</a></li>
    </ul>
  </div>
</Layout>
