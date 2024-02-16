import express, { Request, Response } from 'express'
import { generateAccessToken } from '../../jwt.js'
import { createUser, loginUser } from '../methods/auth.js'
const router = express.Router({ mergeParams: true })

router.post('/register/', async (req: Request, res: any) => {
  if (!req?.body?.username) return res.apiStatus('missingUsername', 404)
  if (!req?.body?.password) return res.apiStatus('missingPassword', 404)

  let user: { dataValues: any } = { dataValues: {} }

  try {
    user = (await createUser(req.body)) as any
  } catch (e: any) {
    return res.apiStatus(e.message, 403)
  }

  const token = generateAccessToken(user.dataValues)
  res.apiStatus(token)
})

router.post('/login/', async (req: Request, res: any) => {
  if (!req?.body?.username) return res.apiStatus('unknownUsername', 404)
  if (!req?.body?.password) return res.apiStatus('unknownUsername', 404)

  let user: { dataValues: any } = { dataValues: {} }
  try {
    user = (await loginUser(req.body.username, req.body.password)) as any
  } catch (e: any) {
    return res.apiStatus(e.message, 403)
  }

  const token = generateAccessToken(user.dataValues)
  res.apiStatus(token)
})

router.get('*', (req: Request, res: Response) => {
  res.send('Route Auth')
})

export default router
