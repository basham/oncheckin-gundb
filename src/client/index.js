const rawData = document.getElementById('data')?.text
const data = rawData ? JSON.parse(rawData) : { route: 'index' }
const pages = import.meta.glob(`../pages/**/*.svelte`)
const key = (part) => `../pages/${part}.svelte`
const module = pages[key(data.route)] || pages[key(`${data.route}/index`)]

if (module) {
  const Page = (await module()).default
  const context = new Map(Object.entries({ data }))
  const target = document.body
  new Page({ context, target })
}
