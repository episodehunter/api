import { Db } from '../types/context.type'
import { WatchedEpisode, WatchedEpisodePage } from '../root-type'
import { watchedTableName } from '../tables'
import { safeMap } from '../util'
import { mapDatabaseWatchedEpisodeToDefinition } from '../episode/episode.util'

type GetUserEpisodeHistory = (
  userId: string,
  offset: number,
  limit: number
) => Promise<WatchedEpisode[]>

export function getGetUserEpisodeHistory(db: Db): GetUserEpisodeHistory {
  return (userId, offset, limit) => {
    return db
      .select('id', 'serie_id', 'season', 'episode', 'type', 'time')
      .from(watchedTableName)
      .where('user_id', userId)
      .orderBy('time', 'desc')
      .offset(offset)
      .limit(limit)
      .then(watched => safeMap(watched, mapDatabaseWatchedEpisodeToDefinition)) as any
  }
}

export async function getUserEpisodeHistoryPage(
  userId: string,
  offset = 0,
  limit = 100,
  getUserEpisodeHistory: GetUserEpisodeHistory
): Promise<WatchedEpisodePage> {
  const safeLimit = Math.max(Math.min(limit, 100), 0)
  const safeOffset = Math.max(Math.min(offset, 1e5), 0)
  const history = await getUserEpisodeHistory(userId, safeOffset, safeLimit + 1)
  const hasNextPage = history.length > safeLimit
  if (hasNextPage) {
    history.pop() // Remove the extra element
  }
  return {
    pageInfo: {
      hasNextPage
    },
    episodes: history
  }
}
