import cuid from 'cuid'
import { registerRoute } from 'workbox-routing'
import { getAccount, renameAccount } from './account.js'
import { addAccount, addDoc, getCurrentAccountId, getDevice, renameDevice, setCurrentAccount } from './device.js'
import { createDoc, getDoc, importDoc } from './doc.js'
import { APP_NAME } from '../constants.js'

registerRoute(
  matchPath('/api/device.json'),
  async () => {
    const data = await getDevice()
    return respondWithJSON(data)
  }
)

registerRoute(
  matchPath('/api/account.json'),
  async () => {
    const data = await getAccount()
    return respondWithJSON(data)
  }
)

const accountRE = new RegExp('^/api/account/(?<accountId>[\\w-]+)\.json$')
registerRoute(
  ({ url }) => accountRE.test(url.pathname),
  async ({ url }) => {
    const match = url.pathname.match(accountRE)
    const { accountId } = match.groups
    const data = await getAccount(accountId)
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
  matchPath('/get-started'),
  async () => {
    const device = await getDevice()
    if (device.state === 'active') {
      return Response.redirect('/account')
    }
    const heading = 'Get started'
    const title = createTitle(heading)
    const route = 'get-started'
    const data = { route, heading }
    return respondWithTemplate({ title, data })
  }
)

registerRoute(
  matchPath('/get-started'),
  async ({ request }) => {
    const data = await request.formData()
    const deviceName = data.get('deviceName')
    await renameDevice(deviceName)
    const { id } = await getAccount()
    const accountName = data.get('accountName')
    await renameAccount(id, accountName)
    await addAccount(id)
    await setCurrentAccount(id)
    return Response.redirect('/account')
  },
  'POST'
)

registerRoute(
  matchPath('/account'),
  async () => {
    const heading = 'Account'
    const title = createTitle(heading)
    const route = 'account'
    const device = await getDevice()
    const id = await getCurrentAccountId()
    const account = await getAccount(id)
    const data = { route, heading, device, account }
    return respondWithTemplate({ title, data })
  }
)

registerRoute(
  matchPath('/doc/new'),
  () => {
    const heading = 'New database'
    const title = createTitle(heading)
    const route = 'doc.new'
    const data = { route, heading }
    return respondWithTemplate({ title, data })
  }
)

registerRoute(
  matchPath('/doc/new'),
  async ({ request }) => {
    const data = await request.formData()
    const name = data.get('name')
    const { id } = await createDoc({ name })
    await addDoc(id)
    return Response.redirect(`/doc/${id}`)
  },
  'POST'
)

registerRoute(
  matchPath('/doc/import'),
  () => {
    const heading = 'Import database'
    const title = createTitle(heading)
    const route = 'doc.import'
    const data = { route, heading }
    return respondWithTemplate({ title, data })
  }
)

registerRoute(
  matchPath('/doc/import'),
  async ({ request }) => {
    const data = await request.json()
    const { id } = await importDoc(data)
    return Response.redirect(`/doc/${id}`)
  },
  'POST'
)

const docRE2 = new RegExp('^/doc/(?<docId>[\\w-]+)$')
registerRoute(
  ({ url }) => docRE2.test(url.pathname),
  async ({ url }) => {
    const match = url.pathname.match(docRE2)
    const { docId } = match.groups
    const route = 'doc.[docId].events.index'
    const heading = 'Events'
    const title = createTitle(heading)
    const doc = await getDoc(docId)
    const upcomingEvents = []
    const recentEvents = []
    const years = []
    const data = { route, heading, doc, docId, upcomingEvents, recentEvents, years }
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
