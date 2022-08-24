<script>
  import { getContext, onMount } from 'svelte'
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import { WebrtcProvider } from 'y-webrtc'
  import Layout from '@src/ui/layouts/public.svelte'

  const params = getContext('params')
  const { id } = params

  const ydoc = new Y.Doc()
  const localProvider = new IndexeddbPersistence(id, ydoc)
  const remoteProvider = new WebrtcProvider(id, ydoc)

  const metaDoc = new Y.Doc()
  metaDoc.getMap('docs').set(id, (new Date()).toJSON())
  const metaDocProvider = new IndexeddbPersistence('oncheckin-meta', metaDoc)

  let counter = 0

  onMount(async () => {
    await localProvider.whenSynced

    const data = ydoc.getMap('data')
    counter = data.get('counter') ?? 0

    data.observe((e) => {
      counter = data.get('counter')
    })
  })

  async function increment () {
    await localProvider.whenSynced
    const data = ydoc.getMap('data')
    counter = (data.get('counter') ?? 0) + 1
    data.set('counter', counter)
  }
</script>

<Layout>
  <div>
    <a href="?p=yjs">Back</a>
  </div>
  <h1>Yjs: {id}</h1>
  <div class="u-flex u-flex-gap-4 u-m-top-6">
    <button
      class="button button--primary"
      on:click={increment}>
      Increment
    </button>
  </div>
  <p class="u-m-top-6">Counter: {counter}</p>
</Layout>
