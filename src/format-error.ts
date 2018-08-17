import * as Raven from 'raven'
import { UnauthorizedError } from './custom-error'
import { config } from './config'

export function formatError(error: any) {
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
