import express, { Request, Response } from 'express'
import { Router } from 'express'
import { updateStatus, getUserById } from '../methods/user'
import models from '../../model'
import { authToken } from '../../jwt'
import ChatServer from '../../chatServer'

const router: Router = express.Router({ mergeParams: true })

interface UserPayload {
  id: number
  nickname: string
  avatar: string
}

interface CustomRequest extends Request {
  user: UserPayload
}

router.get('/getInfo/self', authToken, async (req: CustomRequest, res: any) => {
  const user = await getUserById(req.user.id)
  res.apiStatus(user)
})

router.get('/getSettings/', async (req: CustomRequest, res: any) => {
  const statusOptions = await models.Status.findAll({
    raw: false,
  })

  const output = {
    status: statusOptions,
  }

  res.apiStatus(output)
})

router.get('/getInfo/:id', async (req: CustomRequest, res: any) => {
  const id: number = parseInt(req?.params?.id)
  const user = await getUserById(id || 0)

  if (user) {
    res.apiStatus(user)
  } else {
    res.apiStatus('no user found', 404)
  }
})

router.put('/update', authToken, async (req: CustomRequest, res: any) => {
  const user = await models.User.findByPk(req.user.id)

  const updateInfo = {
    ...user.dataValues,
    status: req.body.status,
    motd: req.body.motd,
  }

  const updated = (await updateStatus(req.user.id, updateInfo)) as number

  if (updated > 0) {
    const user = await getUserById(req.user.id)
    self.socket?.io.emit('contacts/receiveContactUpdate', user)
    res.apiStatus(user)
  } else {
    res.apiStatus('Update failed', 500)
  }
})

router.get('/', (req: Request, res: Response) => {
  res.send('Route User')
})

const self = {
  router,
  socket: null as ChatServer | null,
}

export default self
