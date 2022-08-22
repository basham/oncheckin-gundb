import cuid from 'cuid'
import { getAccount } from './account.js'
import { getDoc } from './doc.js'

self.addEventListener('fetch', (event) => {
  if (/api\/test\.json$/.test(event.request.url)) {
    respondWithJSON(event, () => ({ foo: 'bar', cuid: cuid() }))
  }

  if (/api\/test\.html$/.test(event.request.url)) {
    respondWithHTML(event, () => '<h1>API test</h1>')
  }

  if (/api\/account\.json$/.test(event.request.url)) {
    respondWithJSON(event, () => getAccount())
  }

  const re = /api\/doc\/(?<docId>[\w-]+)\.json$/
  if (re.test(event.request.url)) {
    const match = event.request.url.match(re)
    const { docId } = match.groups
    respondWithJSON(event, () => getDoc(docId))
  }
})

function respondWithHTML (event, getData) {
  event.respondWith(createHTMLResponse(getData))
}

function respondWithJSON (event, getData) {
  event.respondWith(createJSONResponse(getData))
}

async function createHTMLResponse (getData) {
  const body = await getData()
  const options = createResponseOptions('text/html')
  return new Response(body, options)
}

async function createJSONResponse (getData) {
  const data = await getData()
  const body = JSON.stringify(data)
  const options = createResponseOptions('application/json')
  return new Response(body, options)
}

function createResponseOptions (contentType) {
  return {
    headers: {
      'Content-Type': contentType
    }
  }
}
