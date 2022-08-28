import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import './routes.js'

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
