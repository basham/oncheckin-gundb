import { Workbox } from 'workbox-window'
import App from './components/app.svelte'

const wb = new Workbox('./service-worker.js')
wb.register()

const app = new App({
  target: document.body
})

export default app
