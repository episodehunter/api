import { graphqlExpress } from 'apollo-server-express'
import { json } from 'body-parser'
import * as express from 'express'
import * as Raven from 'raven'
import * as cors from 'cors'
import { Context } from './types/context.type'
import { connect } from './database'
import { config } from './config'
import { schema } from './root-schema'
import { extractUserId } from './util'
import { UnauthorizedError } from './custom-error'
import { checkJwt } from './auth'

function formatError(error: any) {
  if (error.originalError instanceof UnauthorizedError) {
    return {
      message: error.originalError.message,
      code: error.originalError.name
    }
  }
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
  cors(),
  json({ limit: '5kb' }),
  checkJwt,
  graphqlExpress((req: any) => ({
    schema,
    context: {
      db: connect(),
      userId: extractUserId(req.user)
    } as Context,
    formatError,
    tracing: false,
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
