import { Show, ShowDatabaseType } from '../root-type'
import { safeStringSplit } from '../util'

export function mapDatabaseShowToDefinition(show: ShowDatabaseType): Show {
  return {
    id: show.id,
    tvdbId: show.tvdb_id,
    imdbId: show.imdb_id,
    name: show.name,
    airsDayOfWeek: show.airs_dayOfWeek,
    airsTime: show.airs_time,
    firstAired: show.first_aired,
    genre: safeStringSplit(show.genre, '|'),
    language: show.language,
    network: show.network,
    overview: show.overview,
    runtime: show.runtime,
    ended: show.status === 'Ended'
  }
}
