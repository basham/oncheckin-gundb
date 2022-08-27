export const APP = 'oncheckin'

export const APP_NAME = 'OnCheckIn'

export const ROUTES = [
  'workspaces',
  'import',
  'new',
  'created/[docId]',
  'join/[code]',
  'open/[docId]',
  '[docId]/events/index',
  '[docId]/events/new',
  '[docId]/events/[eventId]/index',
  '[docId]/events/[eventId]/check-ins/new',
  '[docId]/events/[eventId]/check-ins/[participantId]/edit',
  '[docId]/events/[eventId]/checkpoint',
  '[docId]/events/[eventId]/circle',
  '[docId]/events/[eventId]/edit',
  '[docId]/events/[eventId]/roster',
  '[docId]/events/past/[year]',
  '[docId]/participants/index',
  '[docId]/participants/new',
  '[docId]/participants/[participantId]/index',
  '[docId]/participants/[participantId]/edit',
  '[docId]/participants/[participantId]/hares',
  '[docId]/rename',
  '[docId]/settings',
  '[docId]/share'
]

export const STATE_LOADING = Symbol('loading')
export const STATE_LOADED = Symbol('loaded')
export const STATE_NOT_FOUND = Symbol('not found')
export const STATE = {
  LOADING: STATE_LOADING,
  LOADED: STATE_LOADED,
  NOT_FOUND: STATE_NOT_FOUND
}

export const URL = 'https://oncheck.in/'
