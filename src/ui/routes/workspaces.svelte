<script>
  import { getContext } from 'svelte'
  import Layout from '@src/ui/layouts/public.svelte'

  const account = getContext('account')
  let workspaces = account.docs
</script>

<Layout title="Account">
  <div class="u-flex u-flex-gap-4 u-m-top-6">
    <a class="button button--primary" href="/doc/new">New document</a>
    <a class="button button--secondary" href="/doc/import">Import</a>
  </div>
  <details class="u-m-top-6">
    <summary>Join a workspace</summary>
    <p class="u-m-top-4">Join an existing workspace with an invite link or by scanning a QR&nbsp;code on someone else's device.</p>
  </details>
  {#if workspaces.length}
    <h2>All documents</h2>
    <ul class="list-plain u-gap-2px u-m-top-2">
      {#each workspaces as workspace}
        <li class="row">
          <a
            class="row__left"
            href={`?p=${workspace.id}/events`}>
            <span class="row__primary">{workspace.name}</span>
            <span class="row__secondary">{`Last opened: ${workspace.lastOpenedDisplay}`}</span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</Layout>
