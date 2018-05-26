import { makeExecutableSchema } from 'graphql-tools'
import { RootResolver } from './root-resolver'

const SchemaDefinition = `
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`

const RootQuery = `
  type RootQuery {
    show(id: Int!): Show
    numberOfShowFollowers(showId: Int!): Int
    showRating(showId: Int!): Rating
    ratings(page: Int): [Rating]
    following: [Show]
    watchedEpisodes: [WatchedEpisode]
    history(page: Int): [History]
    popularShows(since: Int!): [Show]
  }
`

const RootMutation = `
  type RootMutation {
    checkInEpisode(episode: WatchedEpisodeInput!): Boolean
    checkInSeason(episodes: [WatchedEpisodeInput]!): Boolean
    rateShow(showId: Int!, rating: Int!): Boolean
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
    rating: Float,
    count: Int!,
    userRating: Int
  }

  enum WatchedEnum {
    kodiScrobble,
    kodiSync,
    checkIn,
    checkInSeason,
    plexScrobble
  }

  type WatchedEpisode {
    showId: Int!,
    season: Int!,
    episode: Int!,
    time: Int!,
    type: WatchedEnum!
  }

  input WatchedEpisodeInput {
    showId: Int!,
    season: Int!,
    episode: Int!,
    time: Int!
  }

  type History {
    episode: Episode,
    time: Int!,
    type: WatchedEnum!
  }
`

export const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, RootQuery, RootMutation, Definitions],
  resolvers: RootResolver as any,
  allowUndefinedInResolve: false
})
