import express from 'express'
// eslint-disable-next-line new-cap
const router = express.Router({ mergeParams: true })

import { updateStatus, getUserById } from '../methods/user.js'
import models from '../../model.js'
import { authToken } from '../../jwt.js'

router.get('/getInfo/self', authToken, async (req, res) => {
  const user = await getUserById(req.user.id)
  res.apiStatus(user)
})

router.get('/getSettings/', async (req, res) => {
  const statusOptions = await models.Status.findAll({
    raw: false,
  })

  const output = {
    status: statusOptions,
  }

  res.apiStatus(output)
})

router.get('/getInfo/:id', async (req, res) => {
  const id = parseInt(req?.params?.id)
  const user = await getUserById(id || 0)

  if (user) {
    res.apiStatus(user)
  } else {
    res.apiStatus('no user found', 404)
  }
})

router.put('/update', authToken, async (req, res) => {
  const user = await models.User.findByPk(req.user.id)

  const updateInfo = {
    ...user.dataValues,
    status: req.body.status,
    motd: req.body.motd,
  }

  const updated = await updateStatus(req.user.id, updateInfo)

  if (updated > 0) {
    const user = await getUserById(req.user.id)
    self.socket.io.emit('contacts/receiveContactUpdate', user)
    res.apiStatus(user)
  } else {
    res.apiStatus('Update unsuccessful', 500)
  }
})

router.get('/', (req, res) => {
  res.send('Route User')
})

const self = {
  router,
  socket: null,
}

export default self
