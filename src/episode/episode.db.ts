import { Db } from '../types/context.type'
import { safeMap } from '../util'
import { Episode, WatchedEpisode, WatchedEnum } from '../root-type'
import {
  mapDatabaseEpisodeToDefinition,
  mapDatabaseWatchedEpisodeToDefinition,
  mapWatchedEpisodeToDatabase
} from './episode.util'
import { doShowExist } from '../show/show.db'
import { episodeTableName, watchedTableName } from '../tables'

export function findAllEpisodesForShowInDb(db: Db, showId: number): Promise<Episode[]> {
  return db
    .select('*')
    .from(episodeTableName)
    .where('serie_id', showId)
    .then(episodes => safeMap(episodes, mapDatabaseEpisodeToDefinition)) as any
}

export function findAllWatchedEpisodesForShowInDb(
  db: Db,
  showId: number,
  userId: string
): Promise<WatchedEpisode[]> {
  return db
    .select('serie_id', 'season', 'episode', 'type', 'time')
    .from(watchedTableName)
    .where('user_id', userId)
    .andWhere('serie_id', showId)
    .then(watched => safeMap(watched, mapDatabaseWatchedEpisodeToDefinition)) as any
}

export function checkInEpisode(db: Db, userId: string, episode: WatchedEpisode) {
  return doShowExist(db, episode.showId).then(exist => {
    if (!exist) {
      return
    }
    return db(watchedTableName)
      .insert(
        Object.assign(mapWatchedEpisodeToDatabase(episode, WatchedEnum.checkIn), {
          user_id: userId
        })
      )
      .then(() => true)
  })
}

export function unwatchEpisode(db: Db, userId: string, episode: WatchedEpisode) {
  return db(watchedTableName)
    .where({
      user_id: userId,
      serie_id: episode.showId,
      season: episode.season,
      episode: episode.episode
    })
    .delete()
    .then(() => true)
}

export function checkInSeason(db: Db, userId: string, episodes: WatchedEpisode[]) {
  const showId = episodes[0].showId
  const episodesOfSameShow = episodes.filter(e => e.showId === showId)
  return doShowExist(db, showId).then(exist => {
    if (!exist) {
      return false
    }
    return db(watchedTableName)
      .insert(
        episodesOfSameShow.map(episode =>
          Object.assign(mapWatchedEpisodeToDatabase(episode, WatchedEnum.checkInSeason), {
            user_id: userId
          })
        )
      )
      .then(() => true)
  })
}
