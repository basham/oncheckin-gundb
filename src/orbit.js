const { Ipfs, OrbitDB } = window

window.LOG = 'orbit*'

export async function loadStores () {
  const node = await Ipfs.create({
    config: {
      Addresses: {
        Swarm: [
          '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
          '/ip4/192.168.7.99/tcp/9090/wss/p2p-webrtc-star'
        ]
      }
    },
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
    accessController: {
      write: ['*']
    }
  }
  const settings = await orbitdb.keyvalue('settings', options)
  await settings.load()

  const peers = await orbitdb.keyvalue('peers', options)
  await peers.load()

  const nodeInfo = await node.id()
  node.libp2p.connectionManager.on('peer:connect', (peer) => {
    console.log('Connect', peer.id)
  })
  await node.pubsub.subscribe('local', (addr) => {
    const data = new TextDecoder().decode(addr.data)
    console.log('Msg', data)
  })

  setInterval(() => {
    node.pubsub.publish('local', `woot from ${nodeInfo.id}`)
  }, 5000)

  console.log('NODE', nodeInfo.id)

  async function connectToPeer (multiaddress, protocol = '/p2p-circuit/ipfs/') {
    await node.swarm.connect(protocol + multiaddress)
  }

  window.oncheckin = {
    connectToPeer,
    node
  }

  return {
    connectToPeer,
    settings
  }
}
