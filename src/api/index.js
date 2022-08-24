import cuid from 'cuid'
import { registerRoute } from 'workbox-routing'
import { getAccount } from './account.js'
import { getDoc } from './doc.js'
// import entry from '@src/index.js?url'

// const routes = import.meta.glob('@src/ui/routes/*', { as: 'url' })

registerRoute(
  ({ url }) => url.pathname === '/api/account.json',
  async () => {
    const data = await getAccount()
    return createJSONResponse(data)
  }
)

registerRoute(
  ({ url }) => url.pathname === '/api/id.json',
  async () => {
    const data = { id: cuid() }
    return createJSONResponse(data)
  }
)

const docRE = new RegExp('^/api/doc/(?<docId>[\\w-]+)\.json$')
registerRoute(
  ({ url }) => docRE.test(url.pathname),
  async ({ url }) => {
    const match = url.pathname.match(docRE)
    const { docId } = match.groups
    const data = await getDoc(docId)
    return createJSONResponse(data)
  }
)

registerRoute(
  ({ url }) => url.pathname === '/workspace',
  async () => {
    const title = 'Account'
    const account = await getAccount()
    const doc = account.docs[0]
    const body = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>${title}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Membership and event management software for Hash House Harriers.">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="msapplication-starturl" content="/">
    <meta name="theme-color" content="#190f05">
    <link rel="manifest" href="./manifest.json">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="stylesheet" href="./style.css">
    <link rel="icon" href="./icon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="./icon-192.png">
    <script type="module" crossorigin src="${entry}"></script>
    <script type="application/json">
${JSON.stringify(account)}
    </script>
    <script type="application/json">
${JSON.stringify(routes)}
    </script>
    <script type="application/json">
${JSON.stringify(entry)}
    </script>
  </head>
  <body>
    <h1>${title}</h1>
    <p>${doc.name}</p>
    <p>${doc.id}</p>
  </body>
</html>
`
    return createHTMLResponse(body)
  }
)

async function createHTMLResponse (body) {
  const options = createResponseOptions('text/html')
  return new Response(body, options)
}

async function createJSONResponse (data) {
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
