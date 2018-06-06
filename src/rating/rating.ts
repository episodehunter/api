import { Db } from '../types/context.type'
import { Rating } from '../root-type'
import { doShowExist } from '../show/show.db'

const showRatingTableName = 'tv_rating'

function getRatingForShow(
  db: Db,
  showId: number
): Promise<{ count: number; rating: number | null }> {
  return db
    .first(db.raw('count(id) as count, SUM(rating)/count(id) as rating'))
    .from(showRatingTableName)
    .where({ show_id: showId }) as any
}

function getUserRatingForShow(
  db: Db,
  showId: number,
  userId: string
): Promise<number | null> {
  return db
    .first('rating')
    .from(showRatingTableName)
    .where({ show_id: showId, user_id: userId })
    .then(rating => (rating ? rating.rating : null)) as any
}

export function getShowRating(db: Db, showId: number, userId?: string): Promise<Rating> {
  const gettingRatingForShow = getRatingForShow(db, showId)
  const gettingUserRatingForShow = userId
    ? getUserRatingForShow(db, showId, userId)
    : null
  return Promise.all([gettingRatingForShow, gettingUserRatingForShow]).then(
    ([showRating, userRating]) => {
      const h = {
        count: showRating.count,
        rating: showRating.rating,
        userRating: userRating
      }
      return h
    }
  )
}

export function rateShow(
  db: Db,
  showId: number,
  userId: string,
  rating: number
): Promise<boolean> {
  if (rating < 1 || rating > 10) {
    return Promise.resolve(false)
  }
  return doShowExist(db, showId).then(exist => {
    if (!exist) {
      return false
    }
    return getUserRatingForShow(db, showId, userId)
      .then(userRating => {
        if (userRating !== null) {
          return db(showRatingTableName)
            .update({ rating })
            .where({ user_id: userId, show_id: showId })
        } else {
          return db(showRatingTableName).insert({
            user_id: userId,
            show_id: showId,
            rating
          })
        }
      })
      .then(() => true)
  })
}
