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
    hollowShows: [HollowShow]
    numberOfShowFollowers(showId: Int!): Int
    showRating(showId: Int!): Rating
    ratings(page: Int): [Rating]
    following: [Show]
    watchedEpisodes(showId: Int!): [WatchedEpisode]
    history(page: Int): [History]
    popularShows(since: Int!): [Show]
    episodeHistory(after: Int, first: Int): WatchedEpisodePage
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

  type HollowShow {
    id: Int!,
    name: String!,
    tvdbId: Int!
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

  type WatchedEpisodePage {
    pageInfo: PageInfo!
    episodes: [WatchedEpisode]!
  }

  type PageInfo {
    lastCursor: Int
    hasNextPage: Boolean!
  }
`

export const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, RootQuery, RootMutation, Definitions],
  resolvers: RootResolver as any,
  allowUndefinedInResolve: false
})
