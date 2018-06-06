import * as admin from 'firebase-admin'
const serviceAccount = require('../firebase-key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://newagent-dc3d1.firebaseio.com'
})

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
        console.error(error)
        res.status(401).send()
      })
  }
}
