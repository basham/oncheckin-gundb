import { getRoute } from './ui/router.js'

const routes = import.meta.glob('@src/ui/routes/*', { as: 'url' })
console.log('R', routes)

const { context, file } = getRoute()
const Page = (await import(`./ui/routes/${file}.svelte`)).default
const target = document.body
new Page({ context, target })
