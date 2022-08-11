<script>
  import { onMount } from 'svelte';
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import { WebrtcProvider } from 'y-webrtc'
  import Layout from '@src/layouts/public.svelte'

  const ydoc = new Y.Doc()
  const localProvider = new IndexeddbPersistence('ydoc-test', ydoc)
  const remoteProvider = new WebrtcProvider('ydoc-test', ydoc, { password: 'abc123' })

  let c = ''

  onMount(async () => {
    await localProvider.whenSynced

    const data = ydoc.getMap('data')

    data.observe((e) => {
      c = data.get('counter')
      console.log('##', ydoc.clientID, ydoc.guid, data.toJSON())
    })

    const counter = data.get('counter') ?? 0
    const newCounter = counter + 1
    data.set('counter', newCounter)
    c = newCounter
  })
</script>

<Layout>
  <h1>Yjs test</h1>
  <p>Count: {c}</p>
</Layout>
