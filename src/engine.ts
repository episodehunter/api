import { config } from './config'

export function engineSetup(app) {
  if (!config.inDevelopMode) {
    const { Engine } = require('apollo-engine')
    const engine = new Engine({
      engineConfig: {
        apiKey: process.env.APOLLO_ENGINE_API_KEY
      },
      graphqlPort: config.port
    })
    engine.start()
    app.use(engine.expressMiddleware())
  }
}
