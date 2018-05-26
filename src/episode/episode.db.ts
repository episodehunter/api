import { Db } from '../types/context.type'
import { safeMap } from '../util'
import { Episode } from '../root-type'
import {
  mapDatabaseEpisodeToDefinition,
  mapDatabaseWatchedEpisodeToDefinition
} from './episode.util'

const episodeTableName = 'tv_episode'
const watchedTableName = 'tv_watched'

export function findAllEpisodesForShowInDb(db: Db, showId: number): Promise<Episode[]> {
  return db
    .select('*')
    .from(episodeTableName)
    .where('serie_id', showId)
    .then(episodes => safeMap(episodes, mapDatabaseEpisodeToDefinition)) as any
}

export function findAllWatchedEpisodesForShowInDb(
  db: Db,
  userId: number
): Promise<Episode[]> {
  return db
    .select('serie_id', 'season', 'episode', 'type', 'time')
    .from(watchedTableName)
    .where('user_id', userId)
    .then(watched => safeMap(watched, mapDatabaseWatchedEpisodeToDefinition)) as any
}
