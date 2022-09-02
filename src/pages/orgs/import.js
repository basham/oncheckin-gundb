import { importOrg } from '@src/api.js'

export function get () {
  const h1 = 'Import organization'
  const template = { h1 }
  return { template }
}

export async function post ({ request }) {
  const data = await request.json()
  const { url: redirect } = await importOrg(data)
  return { redirect }
}
