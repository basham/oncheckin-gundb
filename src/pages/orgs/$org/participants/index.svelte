<script>
  import { h1, org, participants } from '@src/data.js'
  import Layout from '@src/pages/orgs/$org/layout.svelte'
  import Participants from '@src/lib/participants.svelte'
</script>

<Layout>
  <div class="u-flex u-flex-end u-flex-space">
    <h1>{h1}</h1>
    <div>
      <a class="button button--primary" href={`${org.url}participants/new/`}>New hasher</a>
    </div>
  </div>
  <h2>All hashers <span class="badge">{participants.length}</span></h2>
  <Participants participants={participants} />
</Layout>
