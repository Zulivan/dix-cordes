import dotenv from 'dotenv'
import { NextFunction } from 'express'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ParamsDictionary } from 'express-serve-static-core'
import { ParsedQs } from 'qs'

dotenv.config()

const tokenSecret: string = process.env.TOKEN_SECRET || 'none'

interface UserPayload {
  id: number
  nickname: string
  avatar: string
}

interface UserRequest extends Request {
  user: UserPayload
}

interface CustomRequest extends Request {
  user?: UserPayload
}

/** Generates a JWT token for the user
 * @param {UserPayload} data Data to associate with the session
 * @return {string} JWT token
 */
function generateAccessToken(data: UserPayload): string {
  return jwt.sign(data, tokenSecret, {
    expiresIn: '1800s',
  })
}

/** Validates a JWT token
 * @param {string} socket Socket
 * @return {Promise<UserPayload | undefined>} User payload if the token is valid, undefined otherwise
 */
async function socketIOAuth(socket: any): Promise<UserPayload | undefined> {
  const authHeader = socket?.handshake?.headers?.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return

  try {
    const payload = await jwt.verify(token, tokenSecret)
    return payload as UserPayload
  } catch (e) {
    return
  }
}

/** Validates a JWT token
 * @param {string} client Peerjs Client
 * @return {Promise<UserPayload | undefined>} User payload if the token is valid, undefined otherwise
 */
async function peerjsAuth(client: any): Promise<UserPayload | undefined> {
  const token = client.token

  if (!token) return

  try {
    const payload = await jwt.verify(token, tokenSecret)
    return payload as UserPayload
  } catch (e) {
    return
  }
}

/** Retrieves a JWT token for the user
 * @param {Request} req Request
 * @param {Response} res Server response
 * @param {NextFunction} next Next trigger
 * @return {req} Request
 */

function authToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Response | void {
  const authHeader = req.headers['authorization'] as string
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, tokenSecret, (err, user) => {
    if (err) return res.sendStatus(403)

    req.user = user as UserPayload

    return next()
  })
}

export { generateAccessToken, authToken, socketIOAuth, peerjsAuth, UserRequest }
