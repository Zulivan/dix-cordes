import express from 'express'
// import { authToken } from '../../jwt.js'
import models from '../../model.js'
// import { Op } from 'sequelize'
// eslint-disable-next-line new-cap
const router = express.Router({ mergeParams: true })

router.get('/getPeer/:id', async (req, res) => {
  const id = req?.params?.id
  if (!id) return res.apiStatus(null)
  const user = await models.User.findByPk(id, {
    attributes: {
      exclude: ['fname', 'lname', 'password'],
    },
    raw: false,
  })

  try {
    // check if peerjsRelay is set
    if (!user.peerjsrelay || user.peerjsrelay === '')
      throw new Error('User is not available')
    const peerJsRelay = user.peerjsrelay.split('|')

    const output = {
      node: peerJsRelay[0],
      id: peerJsRelay[1],
    }

    res.apiStatus(output)
  } catch (e) {
    console.log(e)
    res.apiStatus(null)
  }
})

router.get('/getAll', async (req, res) => {
  const users = await models.User.findAll({
    attributes: {
      exclude: ['fname', 'lname', 'password', 'peerjsrelay', 'socketrelay'],
    },
    raw: false,
    include: [
      {
        model: models.Status,
        as: 'status_object',
      },
    ],
  })

  res.apiStatus(users)
})

router.get('*', (req, res) => {
  res.send('Route Contacts')
})

export default router
