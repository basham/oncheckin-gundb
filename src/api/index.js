import cuid from 'cuid'
import { getDocument } from './document.js'

self.addEventListener('fetch', async (event) => {
  if (/api\/test\.json$/.test(event.request.url)) {
    respondWithJSON(event, { foo: 'bar', cuid: cuid() })
  }

  if (/api\/test\.html$/.test(event.request.url)) {
    respondWithHTML(event, '<h1>API test</h1>')
  }

  const re = /api\/doc\/(?<docId>[\w-]+)\.json$/
  if (re.test(event.request.url)) {
    const match = event.request.url.match(re)
    const { docId } = match.groups
    const doc = await getDocument(docId)
    respondWithJSON(event, doc)
  }
})

function respondWithHTML (event, body) {
  const options = {
    headers: {
      'Content-Type': 'text/html'
    }
  }
  event.respondWith(new Response(body, options))
}

function respondWithJSON (event, data) {
  const body = JSON.stringify(data)
  const options = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  event.respondWith(new Response(body, options))
}
