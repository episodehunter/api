import { Db } from '../types/context.type'
import { mapDatabaseShowToDefinition } from './show.util'
import { safeMap } from '../util'
import { Show } from '../root-type'

const followingTableName = 'tv_follow'
const showTableName = 'tv_show'

export function getFollowingShowByUser(db: Db, userId: number): Promise<Show[]> {
  return db
    .select(`${showTableName}.*`)
    .from(followingTableName)
    .leftJoin(showTableName, `${showTableName}.id`, `${followingTableName}.show_id`)
    .where({ [`${followingTableName}.user_id`]: userId })
    .then(shows => safeMap(shows, mapDatabaseShowToDefinition)) as any
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
