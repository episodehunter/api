import { Db } from '../types/context.type'
import { mapDatabaseShowToDefinition } from './show.util'
import { safeMap } from '../util'
import { Show, HollowShow } from '../root-type'
import { showTableName, followingTableName } from '../tables'

export function getFollowingShowByUser(db: Db, userId: string): Promise<Show[]> {
  return db
    .select(`${showTableName}.*`)
    .from(followingTableName)
    .leftJoin(showTableName, `${showTableName}.id`, `${followingTableName}.show_id`)
    .where({ [`${followingTableName}.user_id`]: userId })
    .then(shows => safeMap(shows, mapDatabaseShowToDefinition)) as any
}

export function getNumberOfShowFollowers(db: Db, showId: number): Promise<number> {
  return db(followingTableName)
    .count('id as c')
    .where('show_id', showId)
    .then(([{ c }]) => c) as any
}

export function findShow(db: Db, id: number): Promise<Show> {
  return db
    .first(`*`)
    .from(showTableName)
    .where({ id })
    .then(show => {
      if (!show) {
        return null
      }
      return mapDatabaseShowToDefinition(show)
    }) as any
}

export function getHollowShows(db: Db): Promise<HollowShow> {
  return db.select('id', 'name', 'tvdb_id as tvdbId').from(showTableName) as any
}

export function doShowExist(db: Db, id: number): Promise<boolean> {
  return db
    .first('id')
    .from(showTableName)
    .where({ id })
    .then(show => Boolean(show && show.id)) as any
}

function followingShow(db: Db, userId: string, showId: number): Promise<boolean> {
  return db
    .first('id')
    .from(followingTableName)
    .where({ user_id: userId, show_id: showId })
    .then(following => Boolean(following && following.id)) as any
}

export async function followShow(
  db: Db,
  userId: string,
  showId: number
): Promise<boolean> {
  const showExist = await doShowExist(db, showId)
  if (!showExist) {
    return false
  }

  const alreadyFollowingShow = await followingShow(db, userId, showId)
  if (alreadyFollowingShow) {
    return true
  }

  return db(followingTableName)
    .insert({ user_id: userId, show_id: showId })
    .then(() => true)
}

export function unfollowShow(db: Db, userId: string, showId: number): Promise<boolean> {
  return db(followingTableName)
    .where({
      user_id: userId,
      show_id: showId
    })
    .delete()
    .then(() => true) as any
}
