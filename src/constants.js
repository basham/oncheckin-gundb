export const APP = 'oncheckin'

export const APP_NAME = 'OnCheckIn'

export const ROUTES = [
  'events/index',
  'events/new',
  'events/[id]/index',
  'events/[id]/check-ins/new',
  'events/[id]/check-ins/[pid]/edit',
  'events/[id]/checkpoint',
  'events/[id]/circle',
  'events/[id]/edit',
  'events/[id]/roster',
  'events/past/[year]',
  'participants/index',
  'participants/new',
  'participants/[id]/index',
  'participants/[id]/edit',
  'participants/[id]/hares',
  'settings/index',
  'settings/edit-pub',
  'settings/rename',
  'settings/share',
  'workspaces/index',
  'workspaces/new',
  'workspaces/created/[id]',
  'workspaces/join/[code]',
  'workspaces/open/[id]',
  'yjs/index',
  'yjs/[id]'
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
