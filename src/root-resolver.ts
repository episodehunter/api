import { Context } from './types/context.type'
import {
  getFollowingShowByUser,
  findShow,
  getNumberOfShowFollowers
} from './show/show.db'
import { Show, WatchedEpisode, WatchedEnum } from './root-type'
import {
  findAllEpisodesForShowInDb,
  findAllWatchedEpisodesForShowInDb,
  checkInEpisode,
  checkInSeason
} from './episode/episode.db'
import { assertUserId } from './util'
import { getShowRating, rateShow } from './rating/rating'

export const RootResolver = {
  RootQuery: {
    following(obj: void, args: void, context: Context) {
      assertUserId(context.userId)
      return getFollowingShowByUser(context.db, context.userId)
    },

    show(obj: void, args: { id: number }, context: Context) {
      return findShow(context.db, args.id)
    },

    numberOfShowFollowers(obj: void, args: { showId: number }, context: Context) {
      return getNumberOfShowFollowers(context.db, args.showId)
    },

    showRating(obj: void, args: { showId: number }, context: Context) {
      return getShowRating(context.db, args.showId, context.userId)
    },

    ratings(obj: void, args: { page?: number }, context: Context) {
      return null
    },

    watchedEpisodes(obj: void, args: { showId: number }, context: Context) {
      assertUserId(context.userId)
      return findAllWatchedEpisodesForShowInDb(context.db, args.showId, context.userId)
    },

    history(obj: void, args: { showId?: number }, context: Context) {
      return null
    },

    popularShows(obj: void, args: { showId?: number }, context: Context) {
      return null
    }
  },

  RootMutation: {
    checkInEpisode(obj: void, args: { episode: WatchedEpisode }, context: Context) {
      assertUserId(context.userId)
      return checkInEpisode(context.db, context.userId, args.episode)
    },
    checkInSeason(obj: void, args: { episodes: WatchedEpisode[] }, context: Context) {
      assertUserId(context.userId)
      return checkInSeason(context.db, context.userId, args.episodes)
    },
    rateShow(obj: void, args: { showId: number; rating: number }, context: Context) {
      assertUserId(context.userId)
      return rateShow(context.db, args.showId, context.userId, args.rating)
    }
  },

  Show: {
    episodes: (show: Show, args: {}, context: Context) => {
      return findAllEpisodesForShowInDb(context.db, show.id)
    }
  },

  WatchedEpisode: {
    type: (watchedEpisode: WatchedEpisode, args: {}, context: Context) => {
      return WatchedEnum[watchedEpisode.type]
    }
  }
}
