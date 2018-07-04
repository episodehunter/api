import { Db } from '../types/context.type'
import { WatchedEpisode, WatchedEpisodePage } from '../root-type'
import { watchedTableName } from '../tables'
import { safeMap } from '../util'
import { mapDatabaseWatchedEpisodeToDefinition } from '../episode/episode.util'

type GetUserEpisodeHistory = (
  userId: string,
  after: number,
  limit: number
) => Promise<WatchedEpisode[]>

export function getGetUserEpisodeHistory(db: Db): GetUserEpisodeHistory {
  return (userId, after, limit) => {
    let baseQuery = db
      .select('id', 'serie_id', 'season', 'episode', 'type', 'time')
      .from(watchedTableName)
      .where('user_id', userId)
      .orderBy('time', 'desc')
      .limit(limit)

    if (after) {
      baseQuery = baseQuery.where('id', '>', after)
    }

    return baseQuery.then(watched =>
      safeMap(watched, mapDatabaseWatchedEpisodeToDefinition)
    ) as any
  }
}

export async function getUserEpisodeHistoryPage(
  userId: string,
  after: number,
  first = 20,
  getUserEpisodeHistory: GetUserEpisodeHistory
): Promise<WatchedEpisodePage> {
  const limit = Math.min(first | 0, 20)
  const history = await getUserEpisodeHistory(userId, after, limit + 1)
  const hasNextPage = history.length > first
  history.shift() // Remove the extra element
  const lastCursor = getLastCursor(history)
  return {
    pageInfo: {
      hasNextPage,
      lastCursor
    },
    episodes: history
  }
}

export function getLastCursor(history: WatchedEpisode[]): number | null {
  if (history.length > 0) {
    return history[0].id
  }
  return null
}
