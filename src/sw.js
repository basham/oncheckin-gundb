import cuid from 'cuid'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('fetch', (event) => {
  if (/api\/test\.json$/.test(event.request.url)) {
    event.respondWith(new Response(
      JSON.stringify({ foo: 'bar', cuid: cuid() }),
      { headers: { 'Content-Type': 'application/json' } }
    ))
  }

  if (/api\/test\.html$/.test(event.request.url)) {
    event.respondWith(new Response(
      '<h1>API test</h1>',
      { headers: { 'Content-Type': 'text/html' } }
    ))
  }
})
