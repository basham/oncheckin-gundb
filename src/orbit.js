const { Ipfs, OrbitDB } = window

export async function loadStores () {
  const node = await Ipfs.create({
    EXPERIMENTAL: { pubsub: true },
    relay: {
      enabled: true,
      hop: {
        active: true,
        enabled: true
      }
    },
    repo: './ipfs'
  })
  const orbitdb = await OrbitDB.createInstance(node)
  const options = {
    write: ['*']
  }
  const settings = await orbitdb.keyvalue('settings', options)
  await settings.load()

  const peers = await orbitdb.keyvalue('peers', options)
  await peers.load()

  const nodeInfo = await node.id()
  node.libp2p.connectionManager.on('peer:connect', (peer) => {
    console.log('Connect', peer)
  })
  await node.pubsub.subscribe(nodeInfo.id, (msg) => {
    console.log('Msg', msg)
  })

  return {
    settings
  }
}
