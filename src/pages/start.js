import { addAccount, createAccount, renameAccount, renameDevice, setCurrentAccount } from '@src/api.js'

const redirect = '/orgs/'

export async function get ({ data }) {
  const { device } = data
  if (device.state === 'active') {
    return { redirect }
  }
  const h1 = 'Get started'
  const template = { h1 }
  return { template }
}

export async function post ({ request, data }) {
  const formData = await request.formData()
  const deviceName = formData.get('deviceName')
  await renameDevice(deviceName)
  const accountName = formData.get('accountName')
  const account = await createAccount()
  await renameAccount(account.id, accountName)
  await addAccount(account.id)
  await setCurrentAccount(account.id)
  return { redirect }
}
