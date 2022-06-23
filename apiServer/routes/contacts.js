import express from 'express'
// import { authToken } from '../../jwt.js'
import models from '../../model.js'
// import { Op } from 'sequelize'
// eslint-disable-next-line new-cap
const router = express.Router({ mergeParams: true })

router.get('/getAll', async (req, res) => {
  const users = await models.User.findAll({
    attributes: {
      exclude: ['fname', 'lname', 'password'],
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
