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
      },
      Bootstrap: []
    },
    repo: './ipfs' + Math.random()
  })
  /*
  const orbitdb = await OrbitDB.createInstance(node)
  const publicDBOptions = {
    accessController: {
      write: ['*']
    }
  }
  const privateDBOptions = {
    accessController: {
      write: [orbitdb.identity.id]
    }
  }
  const settings = await orbitdb.keyvalue('settings', privateDBOptions)
  await settings.load()

  const peers = await orbitdb.keyvalue('peers', privateDBOptions)
  await peers.load()
  */
  const nodeInfo = await node.id()
  node.libp2p.on('peer:connect', (peer) => {
    console.log('Connect 1', peer.remoteAddr.toString())
  })
  node.libp2p.connectionManager.on('peer:connect', (peer) => {
    console.log('Connect 2', peer.remoteAddr.toString())
  })
  await node.pubsub.subscribe('ping', async (addr) => {
    if (addr.from !== nodeInfo.id) {
      const data = new TextDecoder().decode(addr.data)
      await connectToPeer(addr.from)
      console.log('Msg', data, addr.from)
    }
  })

  setInterval(async () => {
    node.pubsub.publish('ping', 'connect')
    const p = await node.swarm.peers()
    console.log('PEERS', p)
    const p2 = await node.pubsub.peers('ping')
    console.log('ping peers', p2)
  }, 5000)

  async function connectToPeer (multiaddress, protocol = '/p2p-circuit/ipfs/') {
    await node.swarm.connect(protocol + multiaddress)
  }

  window.oncheckin = {
    connectToPeer,
    node
  }

  return {
    connectToPeer,
    node,
    nodeInfo//,
    // settings
  }
}
