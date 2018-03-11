import { config } from './config'

export function engineStart(hostname, app) {
  const { ApolloEngine } = require('apollo-engine')
  const engine = new ApolloEngine({
    apiKey: process.env.APOLLO_ENGINE_API_KEY
  })
  engine.listen(
    {
      port: config.port,
      host: hostname,
      graphqlPaths: ['/graphql'],
      expressApp: app,
      launcherOptions: {
        startupTimeout: 3000
      }
    },
    () => {
      console.log(`Running a GraphQL API server at ${hostname}:${config.port}/graphql`)
    }
  )
}
