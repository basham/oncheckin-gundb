import { getRoute } from './router.js'

async function init () {
  try {
    const { context, file } = getRoute()
    const Page = (await import(`./routes/${file}.svelte`)).default
    const target = document.body
    return new Page({ context, target })
  } catch (e) {
    console.error(e)
  }
}

init()
