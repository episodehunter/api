import { Context } from './types/context.type'
import { getFollowingShowByUser, findShow } from './show/show.db'
import { Show } from './root-type'
import { findAllEpisodesForShowInDb } from './episode/episode.db'

export const RootResolver = {
  RootQuery: {
    following(obj: void, args: void, context: Context) {
      return getFollowingShowByUser(context.db, 2)
    },

    show(obj: void, args: { id: number }, context: Context) {
      return findShow(context.db, args.id)
    },

    showRating(obj: void, args: { showId: number }, context: Context) {
      return null
    },

    ratings(obj: void, args: { page?: number }, context: Context) {
      return null
    },

    watchedEpisodes(obj: void, args: { shodId?: number }, context: Context) {
      return null
    },

    history(obj: void, args: { shodId?: number }, context: Context) {
      return null
    },

    popularShows(obj: void, args: { shodId?: number }, context: Context) {
      return null
    }
  },

  Show: {
    episodes: (show: Show, args: {}, context: Context) => {
      return findAllEpisodesForShowInDb(context.db, show.id)
    }
  }
}
