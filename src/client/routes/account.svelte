<script>
  import { getContext } from 'svelte'
  import Layout from '@src/client/layouts/public.svelte'

  const { device, account } = getContext('data')
  const { docs } = account
</script>

<Layout>
  <div class="u-m-top-4">{account.name} ({device.name})</div>
  <div class="u-flex u-flex-gap-4 u-m-top-6">
    <a class="button button--primary" href="/docs/new">New database</a>
    <a class="button button--secondary" href="/docs/import">Import</a>
  </div>
  <details class="u-m-top-6">
    <summary>Add an existing document</summary>
    <p class="u-m-top-4">Add an existing document with an invite link or by scanning a QR&nbsp;code on someone else's device.</p>
  </details>
  {#if docs.length}
    <h2>All documents</h2>
    <ul class="list-plain u-gap-2px u-m-top-2">
      {#each docs as doc}
        <li class="row">
          <a
            class="row__left"
            href={doc.url}>
            <span class="row__primary">{doc.name}</span>
            <span class="row__secondary">{`ID: ${doc.id}`}</span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</Layout>
