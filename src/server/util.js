import cuid from 'cuid'
import { registerRoute as originalRegisterRoute } from 'workbox-routing'
import { APP_NAME } from '../constants.js'

export function createId () {
  return cuid()
}

export function createPath (...args) {
  const includeTail = args.length && !args[args.length - 1].includes('.')
  return `/${args.join('/')}${includeTail ? '/' : ''}`
}

export function createResponse (body, contentType) {
  const options = {
    headers: {
      'Content-Type': contentType
    }
  }
  return new Response(body, options)
}

export function createTitle (h1, h2) {
  return [h2, h1, APP_NAME].filter((t) => t).join(' - ')
}

export function regexFromPath (path) {
  const p = path
    // Replace `[key]` with a group of the name name.
    .replace(/\[(\w+)\]/g, (match, p1) => `(?<${p1}>[\\w-]+)`)
    // Make trailing `/` optional.
    .replace(/\/$/, '/?')
  return new RegExp(`^${p}$`)
}

export function registerRoute (path, handler, method) {
  const re = regexFromPath(path)
  originalRegisterRoute(
    ({ url }) => re.test(url.pathname),
    (options) => {
      const keys = options.url.pathname.match(re).groups
      const route = path
        .replace(/^\//, '')
        .replace(/\/$/, '')
      return handler({ ...options, keys, route })
    },
    method
  )
}

export function respondWithHTML (body) {
  return createResponse(body, 'text/html')
}

export function respondWithJSON (data) {
  const body = JSON.stringify(data)
  return createResponse(body, 'application/json')
}

export function respondWithTemplate (data) {
  const entryBase = import.meta.env.DEV ? '/src/client' : ''
  const { title = createTitle(data.h1, data.h2) } = data
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

export function todayDate () {
  const now = new Date()
  now.setHours(0, 0, 0)
  return now.toJSON().split('T')[0]
}
