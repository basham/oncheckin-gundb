<script>
  import { getContext } from 'svelte'
  import Layout from '@src/pages/orgs/$orgId/layout.svelte'
  import Participants from '@src/lib/participants.svelte'

  const { h1, org, participants } = getContext('data')
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
