import { graphqlExpress } from 'apollo-server-express'
import { json } from 'body-parser'
import * as express from 'express'
import * as Raven from 'raven'
import { engineSetup } from './engine'
import { Context } from './types/context.type'
import { connect } from './database'
import { config } from './config'
import { schema } from './root-schema'

function formatError(error: any) {
  const errorId = Math.random()
  const errorObj = {
    errorId,
    code: (error.originalError && error.originalError.name) || 'Error',
    message: error.message,
    locations: error.locations,
    stack: error.stack,
    path: error.path
  }
  console.error(errorObj)

  if (config.inDevelopMode) {
    return errorObj
  }
  Raven.captureException(error.orginalError || errorObj)
  return {
    message: error.message || 'This was bad',
    errorId,
    code: (error.originalError && error.originalError.name) || 'Error'
  }
}

const app = express()

engineSetup(app)

if (!config.inDevelopMode) {
  Raven.config(`https://${config.raven.dsn}@sentry.io/${config.raven.project}`, {
    autoBreadcrumbs: false
  }).install()
  app.use(Raven.requestHandler())
}

app.get('/', (req, res) => {
  res.send('Episodehunter api')
})

app.use(
  '/graphql',
  json({ limit: '100kb' }),
  graphqlExpress(req => ({
    schema,
    context: {
      db: connect()
    } as Context,
    formatError,
    tracing: true,
    cacheControl: false
  }))
)

app.use(Raven.errorHandler())

app.use((err: any, req: any, res: any, next: any) => {
  if (err.status !== 401) {
    console.error(err)
  }
  res.status(err.status || 500).send()
})

const hostname = 'localhost'
app.listen(config.port, hostname, () => {
  console.log(`Running a GraphQL API server at ${hostname}:${config.port}/graphql`)
})
