import { Context } from './types/context.type'
import {
  getFollowingShowByUser,
  findShow,
  getNumberOfShowFollowers,
  getHollowShows,
  followShow,
  unfollowShow
} from './show/show.db'
import { Show, WatchedEpisode, WatchedEnum } from './root-type'
import {
  findAllEpisodesForShowInDb,
  findAllWatchedEpisodesForShowInDb,
  checkInEpisode,
  checkInSeason,
  unwatchEpisode
} from './episode/episode.db'
import { assertUserId } from './util'
import { getShowRating, rateShow } from './rating/rating'
import { getUserEpisodeHistoryPage, getGetUserEpisodeHistory } from './history/history.db'

export const RootResolver = {
  RootQuery: {
    following(obj: void, args: void, context: Context) {
      assertUserId(context.userId)
      return getFollowingShowByUser(context.db, context.userId)
    },

    show(obj: void, args: { id: number }, context: Context) {
      return findShow(context.db, args.id)
    },

    hollowShows(obj: void, args: void, context: Context) {
      return getHollowShows(context.db)
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
    },

    episodeHistory(
      obj: void,
      args: { offset?: number; limit?: number },
      context: Context
    ) {
      assertUserId(context.userId)
      return getUserEpisodeHistoryPage(
        context.userId,
        args.offset,
        args.limit,
        getGetUserEpisodeHistory(context.db)
      )
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
    unwatchEpisode(obj: void, args: { episode: WatchedEpisode }, context: Context) {
      assertUserId(context.userId)
      return unwatchEpisode(context.db, context.userId, args.episode)
    },
    rateShow(obj: void, args: { showId: number; rating: number }, context: Context) {
      assertUserId(context.userId)
      return rateShow(context.db, args.showId, context.userId, args.rating)
    },
    followShow(obj: void, args: { showId: number }, context: Context) {
      assertUserId(context.userId)
      return followShow(context.db, context.userId, args.showId)
    },
    unfollowShow(obj: void, args: { showId: number }, context: Context) {
      assertUserId(context.userId)
      return unfollowShow(context.db, context.userId, args.showId)
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
