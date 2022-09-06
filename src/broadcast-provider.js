import { applyUpdate, encodeStateVector, encodeStateAsUpdate } from 'yjs'

// Because WebRTC is not available in service workers,
// the y-webrtc provider must be in the window context.
// This Broadcast Provider syncs docs in the service worker
// with docs in the window context, as a workaround.

export function createBroadcastProvider (name, ydoc) {
  // Change the channel name, because y-webrtc uses the `name` channel.
  const broadcast = new BroadcastChannel(`bp-${name}`)
  const providerId = Symbol()
  const messageMap = {
    1: step1,
    2: step2,
    3: step3,
    4: step4,
    5: step5
  }
  let resolvePull
  let resolvePush

  broadcast.onmessage = (event) => {
    const [i, data] = event.data
    const nextStep = messageMap[i]
    if (nextStep) {
      nextStep(data)
    }
  }

  ydoc.on('update', (update, origin) => {
    if (origin !== providerId) {
      push()
    }
  })

  // Pushing is telling the remote to pull.
  function push () {
    return new Promise((resolve) => {
      resolvePush = resolve
      step1() // 1 -> 3 -> 5
    })
  }

  function pull () {
    return new Promise((resolve) => {
      resolvePull = resolve
      step2() // 2 -> 4
    })
  }

  async function sync () {
    await pull()
    await push()
  }

  function step1 () {
    postMessage(2)
  }

  function step2 () {
    postMessage(3, encodeStateVector(ydoc))
  }

  function step3 (stateVector) {
    postMessage(4, encodeStateAsUpdate(ydoc, stateVector))
  }

  function step4 (diff) {
    applyUpdate(ydoc, diff, providerId)
    if (resolvePull) {
      resolvePull()
    }
    postMessage(5)
  }

  function step5 () {
    if (resolvePush) {
      resolvePush()
    }
  }

  function postMessage (id, data) {
    broadcast.postMessage([id, data])
  }

  return { pull, push, sync }
}
