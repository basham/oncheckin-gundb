export const APP = 'oncheckin'

export const APP_NAME = 'OnCheckIn'

export const ROUTES = [
  'events/index',
  'events/new',
  'events/[id]/index',
  'events/[id]/circle',
  'events/[id]/edit',
  'events/past/[year]',
  'participants/index',
  'participants/new',
  'participants/[id]/index',
  'participants/[id]/edit',
  'settings/index',
  'settings/edit-pub',
  'settings/rename',
  'settings/share'
]

export const STATE_LOADING = 1
export const STATE_LOADED = 2
export const STATE_NOT_FOUND = 3
export const STATE = {
  LOADING: STATE_LOADING,
  LOADED: STATE_LOADED,
  NOT_FOUND: STATE_NOT_FOUND
}

export const URL = 'https://oncheck.in/'
