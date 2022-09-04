import { createCheckIn, createParticipant, getEventCheckIns, getParticipants } from '@src/api.js'

export async function get ({ data }) {
  const { org, event } = data
  const h1 = event.name
  const h2 = 'New check-in'
  const checkIns = (await getEventCheckIns(org.id, event.id))
    .map((checkIn) => [checkIn.participant.id, checkIn])
  const checkInsMap = new Map(checkIns)
  const participants = (await getParticipants(org.id))
    .map((p) => {
      const checkIn = checkInsMap.get(p.id)
      const checkedIn = !!checkIn
      return {
        ...p,
        checkIn,
        checkedIn
      }
    })
  const template = { h1, h2, participants }
  return { template }
}

export async function post ({ data, request }) {
  const { org, event } = data
  const formData = await request.formData()
  const checkInType = formData.get('checkInType')
  let participantId = formData.get('selectedParticipant')
  if (checkInType === 'new-participant') {
    const alias = formData.get('alias')
    const fullName = formData.get('fullName')
    const participant = await createParticipant(org.id, { alias, fullName })
    participantId = participant.id
  }
  const host = formData.get('host')
  await createCheckIn(org.id, event.id, participantId, { host })
  return { redirect: event.url }
}
