import express, { Request, Response } from 'express'
import { Op } from 'sequelize'
import models from '../../model'
import { APIInterface } from '../index'

const router = express.Router({ mergeParams: true })

router.get('/getPeer/:id', async (req: Request, res: any) => {
  const id: string = req?.params?.id
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
    const peerJsRelay: string[] = user.peerjsrelay.split('|')

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

router.get('/getAll', async (req: Request, res: any) => {
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

router.get('*', (req: Request, res: Response) => {
  res.send('Route Contacts')
})

export default router
