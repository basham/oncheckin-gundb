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
      const { pull } = createBroadcastProvider(storeId, doc)
      await pull()
      const remoteProvider = new WebrtcProvider(storeId, doc)
      const { awareness } = remoteProvider
      awareness.on('change', (changes) => {
        console.log('Awareness', storeId, Array.from(awareness.getStates().values()))
      })
      awareness.setLocalStateField('user', user)
      //console.log('Setting user', storeId, user)
      //doc.on('update', async (update, origin) => {
        // await storeState(localProvider)
      //  console.log('Updated doc', update, origin)
      //})
    //})
  })
</script>

<Upgrader />

<slot></slot>
