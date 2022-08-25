<script>
  import { onMount } from 'svelte'
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import Layout from '@src/client/layouts/public.svelte'
  import { createId } from '@src/util.js'

  const metaDoc = new Y.Doc()
  const metaDocProvider = new IndexeddbPersistence('oncheckin-meta', metaDoc)

  let docs = []

  onMount(async () => {
    await metaDocProvider.whenSynced
    docs = [...metaDoc.getMap('docs').entries()]
      .map(([id, lastVisited]) => ({ id, url: `?p=yjs/${id}`, lastVisited }))
  })

  function newDoc () {
    window.location = `?p=yjs/${createId()}`
  }
</script>

<Layout>
  <h1>Yjs test</h1>
  <div class="u-flex u-flex-gap-4 u-m-top-6">
    <button
      class="button button--primary"
      on:click={newDoc}>
      New counter
    </button>
  </div>
  <h2>Recent docs</h2>
  <ul class="list-plain list-plain--inline u-gap-2px u-m-top-2">
    {#each docs as doc}
      <li class="row">
        <a
          class="row__left u-text-num"
          href={doc.url}>
          <span class="row__primary">{doc.id}</span>
          <span class="row__secondary">{doc.lastVisited}</span>
        </a>
      </li>
    {/each}
  </ul>
</Layout>
