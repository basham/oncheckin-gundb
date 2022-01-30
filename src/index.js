import { getRoute } from './router.js'

async function init () {
  try {
    const route = getRoute()
    const Page = (await import(`./routes/${route.component}.svelte.js`)).default
    return new Page({
      context: new Map(Object.entries(route)),
      target: document.body
    })
  } catch (e) {
    console.error(e)
  }
}

init()
