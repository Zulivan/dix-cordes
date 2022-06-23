import express from 'express'
import { generateAccessToken } from '../../jwt.js'
import { createUser, loginUser } from '../methods/auth.js'

// eslint-disable-next-line new-cap
const router = express.Router({ mergeParams: true })

router.post('/register/', async (req, res) => {
  if (!req?.body?.username) return res.apiStatus('error: no username', 404)
  if (!req?.body?.password) return res.apiStatus('error: no password', 404)

  // Create user
  let user = {
    nickname: req.body.username,
    password: req.body.password,
  }

  try {
    user = await createUser(user)
  } catch (e) {
    return res.apiStatus(e.message, 403)
  }

  const token = generateAccessToken(user.dataValues)
  res.apiStatus(token)
})

router.post('/login/', async (req, res) => {
  if (!req?.body?.username)
    return res.apiStatus('error: no username found', 404)
  if (!req?.body?.password)
    return res.apiStatus('error: no password found', 404)

  let user = {}
  try {
    user = await loginUser(req.body.username, req.body.password)
  } catch (e) {
    return res.apiStatus(e.message, 403)
  }

  const token = generateAccessToken(user.dataValues)
  res.apiStatus(token)
})

router.get('*', (req, res) => {
  res.send('Route Auth')
})

export default router
