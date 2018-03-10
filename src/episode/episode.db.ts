import { Db } from '../types/context.type'
import { safeMap } from '../util'
import { Episode } from '../root-type'
import { mapDatabaseEpisodeToDefinition } from './episode.util'

const episodeTableName = 'tv_episode'

export function findAllEpisodesForShowInDb(db: Db, showId: number): Promise<Episode[]> {
  return db
    .select('*')
    .from(episodeTableName)
    .where('serie_id', showId)
    .then(episodes => safeMap(episodes, mapDatabaseEpisodeToDefinition)) as any
}
