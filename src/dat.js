import './hyper-sdk-bundle.js'
const SDK = window.hyperSDK

export async function init () {
  const sdk = await SDK({
    // persist: false,
    // storage: null
  })
  const { Hypercore, Hyperdrive } = sdk

  const core = Hypercore('test', {
    valueEncoding: 'json'// ,
    // persist: false,
    // storage: null
  })

  await core.append(JSON.stringify({
    name: 'Christopher' + Math.random()
  }))

  const c = await core.get(0)

  // const drive = Hyperdrive('another test')
  // await drive.ready()

  console.log(JSON.parse(c))
}

init()
