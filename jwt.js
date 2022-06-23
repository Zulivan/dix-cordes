import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
// get config vars
dotenv.config()

// access config var
console.log(process.env.TOKEN_SECRET)

/** Génère un token JWT pour l'utilisateur
 * @param {string} data Données à associer à la session
 * @return {string} Token JWT
 */
function generateAccessToken(data) {
  return jwt.sign(data, process.env.TOKEN_SECRET, {
    expiresIn: '1800s',
  })
}

/** Valide un token jwt
 * @param {string} socket Socket
 * @return {void}
 */
async function socketIOAuth(socket) {
  const authHeader = socket?.handshake?.headers?.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return

  try {
    const payload = await jwt.verify(token, process.env.TOKEN_SECRET)
    return payload
  } catch (e) {
    return
  }
}

/** Retrouve un token JWT pour l'utilisateur
 * @param {string} req Requête
 * @param {string} res Réponse serveur
 * @param {string} next Trigger Suivant
 * @return {void}
 */
function authToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    // console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

export { generateAccessToken, authToken, socketIOAuth }
