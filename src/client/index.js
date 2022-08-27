const rawData = document.getElementById('data')?.text
const data = rawData ? JSON.parse(rawData) : { route: 'index' }
const Page = (await import(`./routes/${data.route}.svelte`)).default
const context = new Map(Object.entries({ data }))
const target = document.body
new Page({ context, target })
