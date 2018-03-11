export type ShowStatusType = 'Continuing' | 'Ended'

export interface Show {
  id: number
  tvdbId: number
  imdbId: string
  name: string
  airsDayOfWeek: string
  airsTime: string
  firstAired: string
  genre: string[]
  language: string
  network: string
  overview: string
  runtime: number
  ended: boolean
  episodes?: Episode[]
}

export interface Episode {
  id: number
  tvdbId: number
  serieId: number
  name: string
  season: number
  episode: number
  firstAired: string
  overview: string
}

export interface Rating {
  total: number
  count: number
  userRating: number
}

enum WatchedEnum {
  kodiScrobble,
  kodiSync,
  checkIn,
  checkInSeason,
  plexScrobble
}

export interface WatchedEpisode {
  serieId: number
  season: number
  episode: number
  time: number
  type: WatchedEnum
}

export interface History {
  episode: Episode
  time: number
  type: WatchedEnum
}

export type EpisodeDatabaseType = {
  id: number
  tvdb_id: number
  serie_id: number
  name: string
  season: number
  episode: number
  first_aired: string
  overview: string
  lastupdated: number
}

export type ShowDatabaseType = {
  id: number
  tvdb_id: number
  imdb_id: string
  name: string
  airs_dayOfWeek: string
  airs_time: string
  first_aired: string
  genre: string
  language: string
  network: string
  overview: string
  runtime: number
  status: ShowStatusType
  lastupdate: number
}