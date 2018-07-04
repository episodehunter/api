import {
  EpisodeDatabaseType,
  Episode,
  WatchedEpisode,
  WatchedEpisodeDatabaseType,
  WatchedEnum
} from '../root-type'

export function mapDatabaseEpisodeToDefinition(episode: EpisodeDatabaseType): Episode {
  return {
    id: episode.id,
    tvdbId: episode.tvdb_id,
    serieId: episode.serie_id,
    name: episode.name,
    season: episode.season,
    episode: episode.episode,
    firstAired: episode.first_aired,
    overview: episode.overview
  }
}

export function mapDatabaseWatchedEpisodeToDefinition(
  watchedEpisode: WatchedEpisodeDatabaseType
): WatchedEpisode {
  return {
    id: watchedEpisode.id,
    showId: watchedEpisode.serie_id,
    season: watchedEpisode.season,
    episode: watchedEpisode.episode,
    time: watchedEpisode.time,
    type: watchedEpisode.type
  }
}

export function mapWatchedEpisodeToDatabase(
  watchedEpisode: WatchedEpisode,
  type: WatchedEnum
): WatchedEpisodeDatabaseType {
  return {
    serie_id: watchedEpisode.showId,
    season: watchedEpisode.season,
    episode: watchedEpisode.episode,
    time: watchedEpisode.time,
    type
  }
}
