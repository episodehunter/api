import { makeExecutableSchema } from 'graphql-tools'
import { RootResolver } from './root-resolver'

const SchemaDefinition = `
  schema {
    query: RootQuery
  }
`

const RootQuery = `
  type RootQuery {
    show(id: Int!): Show
    showRating(showId: Int!): Rating
    ratings(page: Int): [Rating]
    following: [Show]
    watchedEpisodes(shodId: Int!): [WatchedEpisode]
    history(page: Int): [History]
    popularShows(since: Int!): [Show]
  }
`

const Definitions = `
  type Show {
    id: Int!,
    tvdbId: Int!,
    imdbId: String,
    name: String!,
    airsDayOfWeek: String,
    airsTime: String,
    firstAired: String,
    genre: [String],
    language: String,
    network: String,
    overview: String,
    runtime: Int,
    ended: Boolean,
    episodes: [Episode]
  }

  type Episode {
    id: Int!,
    tvdbId: Int!,
    serieId: Int!,
    name: String!,
    season: Int!,
    episode: Int!,
    firstAired: String,
    overview: String
  }

  type Rating {
    total: Float!,
    count: Int!,
    userRating: Int
  }

  enum WatchedEnum {
    kodiSync,
    kodiScrobble,
    manuallySync,
    plexScrobble
  }

  type WatchedEpisode {
    serieId: Int!,
    season: Int!,
    episode: Int!,
    time: Int!,
    type: WatchedEnum!
  }

  type History {
    episode: Episode,
    time: Int!,
    type: WatchedEnum!
  }
`

export const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, RootQuery, Definitions],
  resolvers: RootResolver as any,
  allowUndefinedInResolve: false
})
