import { getRoute } from './ui/router.js'

const { context, file } = getRoute()
const Page = (await import(`./ui/routes/${file}.svelte`)).default
const target = document.body
new Page({ context, target })
