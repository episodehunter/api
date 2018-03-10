import { EpisodeDatabaseType, Episode } from '../root-type'

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
