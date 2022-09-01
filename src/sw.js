import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute2 } from './server/util.js'

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

const modules = import.meta.glob('./pages/**/*.js', { eager: true })

// Reverse the list of modules so dynamic `[key]` folders and files are resolved last.
for (const [url, mod] of Object.entries(modules).reverse()) {
  const path = url
    .replace(/^\.\/pages/, '')
    .replace(/\.js$/, '')
  const { get, post } = mod
  if (get) {
    registerRoute2(path, get)
  }
  if (post) {
    registerRoute2(path, post, 'POST')
  }
}
