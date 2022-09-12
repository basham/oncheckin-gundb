const raw = document.getElementById('data')?.text
const data = raw ? JSON.parse(raw) : { route: 'index' }

export { data }
export const {
  account,
  checkIn,
  checkIns,
  code,
  date,
  device,
  event,
  events,
  latestCheckIn,
  route,
  h1,
  h2,
  hares,
  org,
  orgs,
  participant,
  participants,
  recentEvents,
  returnersCutoff,
  runners,
  upcomingEvents,
  years
} = data
