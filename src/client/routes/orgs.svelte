<script>
  import { getContext } from 'svelte'
  import Layout from '@src/client/layouts/public.svelte'

  const { device, account } = getContext('data')
  const { docs: orgs } = account
</script>

<Layout>
  <div class="u-m-top-4">{account.name} ({device.name})</div>
  <div class="u-flex u-flex-gap-4 u-m-top-6">
    <a class="button button--primary" href="/orgs/new">New organization</a>
    <a class="button button--secondary" href="/orgs/import">Import</a>
  </div>
  <details class="u-m-top-6">
    <summary>Add an existing organization</summary>
    <p class="u-m-top-4">Add an existing organization with an invite link or by scanning a QR&nbsp;code on someone else's device.</p>
  </details>
  {#if orgs.length}
    <h2>All organizations</h2>
    <ul class="list-plain u-gap-2px u-m-top-2">
      {#each orgs as org}
        <li class="row">
          <a
            class="row__left"
            href={org.url}>
            <span class="row__primary">{org.name}</span>
            <span class="row__secondary">{`ID: ${org.id}`}</span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</Layout>
