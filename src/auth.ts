import * as admin from 'firebase-admin'

const getToken = (req: { headers: { authorization?: string } }): string | null => {
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ')
    if (parts.length === 2) {
      return parts[1]
    }
  }
  return null
}

export const checkJwt = (req, res, next: () => void) => {
  const token = getToken(req)

  if (!token) {
    next()
  } else {
    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedToken => {
        req.user = {
          id: decodedToken.uid
        }
        next()
      })
      .catch(error => {
        res.status(401).send()
      })
  }
}

export const checkJwtDev = (req, res, next: () => void) => next()
