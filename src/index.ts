import { ApolloServer } from 'apollo-server-express'
import { json } from 'body-parser'
import * as express from 'express'
import * as admin from 'firebase-admin'
import * as Raven from 'raven'
import { checkJwt, checkJwtDev } from './auth'
import { config } from './config'
import { connect } from './database'
import { schema } from './root-schema'
import { Context } from './types/context.type'
import { extractUserId } from './util'
import { formatError } from './format-error'

const graphqlPath = '/graphql'
const authCheck = config.inDevelopMode ? checkJwtDev : checkJwt
const createContext = ({ req }) =>
  ({
    db: connect(),
    userId: extractUserId(req.user)
  } as Context)

const app = express()
app.use(graphqlPath, json({ limit: '5kb' }), authCheck)

new ApolloServer({
  schema,
  context: createContext,
  tracing: false,
  cacheControl: false,
  formatError
}).applyMiddleware({ app, cors: true, path: graphqlPath })

if (!config.inDevelopMode) {
  const firebaseKey = JSON.parse(Buffer.from(config.firebaseKey64, 'base64').toString())
  admin.initializeApp({
    credential: admin.credential.cert(firebaseKey),
    databaseURL: 'https://newagent-dc3d1.firebaseio.com'
  })
  Raven.config(`https://${config.raven.dsn}@sentry.io/${config.raven.project}`, {
    autoBreadcrumbs: false
  }).install()
  app.use(Raven.requestHandler())
}

app.get('/', (req, res) => {
  res.send('Episodehunter api')
})

app.use(Raven.errorHandler())

app.use((err: any, req: any, res: any, next: any) => {
  if (err.status !== 401) {
    console.error(err)
  }
  res.status(err.status || 500).send()
})

const hostname = 'localhost'
app.listen(config.port, hostname, () => {
  console.log(`Running a GraphQL API server at ${hostname}:${config.port}${graphqlPath}`)
})
