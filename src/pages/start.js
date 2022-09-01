import { getAccount, renameAccount } from '@src/server/account.js'
import { addAccount, getDevice, renameDevice, setCurrentAccount } from '@src/server/device.js'

const redirect = '/orgs/'

export async function get () {
  const device = await getDevice()
  if (device.state === 'active') {
    return { redirect }
  }
  const h1 = 'Get started'
  const template = { h1 }
  return { template }
}

export async function post ({ request }) {
  const data = await request.formData()
  const deviceName = data.get('deviceName')
  await renameDevice(deviceName)
  const { id } = await getAccount()
  const accountName = data.get('accountName')
  await renameAccount(id, accountName)
  await addAccount(id)
  await setCurrentAccount(id)
  return { redirect }
}
