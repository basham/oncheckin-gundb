<script>
  import { getContext, onMount } from 'svelte'
  import { Doc as YDoc } from 'yjs'
  import { WebrtcProvider } from 'y-webrtc-packets'
  import Upgrader from '@src/lib/upgrader.svelte'
  import { createBroadcastProvider } from '@src/broadcast-provider.js'
  import { APP_ID } from '@src/constants.js'

  const { account, device, org } = getContext('data')

  onMount(async () => {
    if (!account || !device || !org) {
      return
    }

    const user = {
      accountId: account.id,
      accountName: account.name,
      deviceName: device.name,
      deviceId: device.id
    }
    const orgId = org.id
    //account.orgs.forEach(async (orgId) => {
      const doc = new YDoc()
      const storeId = `${APP_ID}-${orgId}`
      const { pull, push } = createBroadcastProvider(storeId, doc)
      await pull()
      doc.on('update', async (update, origin) => {
        // If origin.peerId exists, then assume it is a Room instance from y-webrtc.
        // When the push is complete, the doc is ready.
        if (!Object.hasOwn(origin, 'peerId')) {
          return
        }
        await push()
        const id = orgId
        const detail = { id }
        const event = new CustomEvent('doc-synced', { detail })
        document.dispatchEvent(event)
      })
      const remoteProvider = new WebrtcProvider(storeId, doc)
      const { awareness } = remoteProvider
      awareness.on('change', (changes) => {
        console.log('Awareness', storeId, Array.from(awareness.getStates().values()))
      })
      awareness.setLocalStateField('user', user)
    //})
  })
</script>

<Upgrader />

<slot></slot>
