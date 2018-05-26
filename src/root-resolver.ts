import { Context } from './types/context.type'
import {
  getFollowingShowByUser,
  findShow,
  getNumberOfShowFollowers
} from './show/show.db'
import { Show, WatchedEpisode, WatchedEnum } from './root-type'
import {
  findAllEpisodesForShowInDb,
  findAllWatchedEpisodesForShowInDb
} from './episode/episode.db'
import { assertUserId } from './util'

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
      return null
    },

    ratings(obj: void, args: { page?: number }, context: Context) {
      return null
    },

    watchedEpisodes(obj: void, args: void, context: Context) {
      assertUserId(context.userId)
      return findAllWatchedEpisodesForShowInDb(context.db, context.userId)
    },

    history(obj: void, args: { showId?: number }, context: Context) {
      return null
    },

    popularShows(obj: void, args: { showId?: number }, context: Context) {
      return null
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
