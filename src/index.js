import { getRoute } from './router.js'

const { context, file } = getRoute()
const Page = (await import(`./routes/${file}.svelte`)).default
const target = document.body
new Page({ context, target })
