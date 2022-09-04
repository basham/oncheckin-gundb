import { isFuture, isPast, isToday } from 'date-fns'
import { getOrCreate, sortDesc } from '@src/util.js'
import { getEvent } from './event.js'
import { getOrgEvents } from './org.js'
import { cache } from './store.js'

export async function getEvents (orgId) {
  return getOrCreate(cache, `events:${orgId}`, async () => {
    const events = await getOrgEvents(orgId)
    const all = []
    for (const eventId of events) {
      const event = await getEvent(orgId, eventId)
      all.push(event)
    }
    return all.sort(sortDesc('dateObj'))
  })
}

export async function getPastEvents (orgId) {
  return (await getEvents(orgId))
    .filter(({ dateObj }) => !isToday(dateObj) && isPast(dateObj))
}

export async function getUpcomingEvents (orgId) {
  return (await getEvents(orgId))
    .filter(({ dateObj }) => isToday(dateObj) || isFuture(dateObj))
    .reverse()
}

export async function getEventYears (orgId) {
  const years = (await getEvents(orgId))
    .map(({ year }) => year)
  return [...(new Set(years))].sort().reverse()
}

export async function getEventsByYear (orgId, year) {
  return (await getEvents(orgId))
    .filter((event) => event.year === year)
    .reverse()
}
