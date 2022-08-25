import cuid from 'cuid'
import { registerRoute } from 'workbox-routing'
import { getAccount } from './account.js'
import { getDoc } from './doc.js'
import { APP_NAME } from '../constants.js'

registerRoute(
  matchPath('/api/account.json'),
  async () => {
    const data = await getAccount()
    return respondWithJSON(data)
  }
)

registerRoute(
  matchPath('/api/id.json'),
  async () => {
    const data = { id: cuid() }
    return respondWithJSON(data)
  }
)

const docRE = new RegExp('^/api/doc/(?<docId>[\\w-]+)\.json$')
registerRoute(
  ({ url }) => docRE.test(url.pathname),
  async ({ url }) => {
    const match = url.pathname.match(docRE)
    const { docId } = match.groups
    const data = await getDoc(docId)
    return respondWithJSON(data)
  }
)

registerRoute(
  matchPath('/account'),
  async () => {
    const title = createTitle('Account')
    const route = 'workspaces'
    const account = await getAccount()
    const data = { account, route }
    return respondWithTemplate({ title, data })
  }
)

registerRoute(
  matchPath('/doc/new'),
  () => {
    const title = createTitle('New database')
    const route = 'new'
    const data = { route }
    return respondWithTemplate({ title, data })
  }
)

registerRoute(
  matchPath('/doc/new'),
  async ({ request }) => {
    const data = await request.formData()
    const name = data.get('name')
    return Response.redirect(`/account?name=${name}`)
  },
  'POST'
)

registerRoute(
  matchPath('/doc/import'),
  () => {
    const title = createTitle('Import database')
    const route = 'import'
    const data = { route }
    return respondWithTemplate({ title, data })
  }
)

function createResponse (body, contentType) {
  const options = {
    headers: {
      'Content-Type': contentType
    }
  }
  return new Response(body, options)
}

function createTitle (title) {
  return [title, APP_NAME].filter((t) => t).join(' - ')
}

function matchPath (pathname) {
  return ({ url }) => url.pathname === pathname
}

function respondWithHTML (body) {
  return createResponse(body, 'text/html')
}

function respondWithJSON (data) {
  const body = JSON.stringify(data)
  return createResponse(body, 'application/json')
}

function respondWithTemplate ({ title, data }) {
  const entryBase = import.meta.env.DEV ? '/src/client' : ''
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
    <link rel="manifest" href="/manifest.json">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="stylesheet" href="/style.css">
    <link rel="icon" href="/icon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/icon-192.png">
    <script id="data" type="application/json">
${JSON.stringify(data)}
    </script>
    <script type="module" crossorigin src="${entryBase}/index.js"></script>
    </head>
  <body>
  </body>
</html>
`
  return respondWithHTML(body)
}
