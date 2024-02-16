import express, { Request, Response, Router } from 'express'
import { authToken, UserRequest } from '../../jwt.js'
import conversation from '../methods/conversation.js'
import models from '../../model.js'
import ChatServer from '../../chatServer'
import sequelize from 'sequelize'

const router: Router = express.Router({ mergeParams: true })

router.get('/list', authToken, async (req: UserRequest, res: any) => {
  const output: any = await conversation.getAll(req.user.id)

  res.apiStatus(output)
})

router.post('/messages', authToken, async (req: UserRequest, res: any) => {
  if (!req?.body?.sender) return res.apiStatus('error: no sender', 404)

  const output: any = await conversation.messages(req.body.sender, req.user.id)

  res.apiStatus(output)
})

router.delete('/messages', authToken, async (req: UserRequest, res: any) => {
  if (!req?.body?.id) return res.apiStatus('error: no id', 404)

  const msg: any = await conversation.getMessage(req.body.id)

  const del: number = await conversation.deleteMessage(req.body.id, req.user.id)

  if (del == 1) {
    const jsonMsg: any = msg.dataValues

    const recipientSocket: any = self.socket?.get(jsonMsg.recipient) as any

    if (recipientSocket)
      recipientSocket.emit('conversations/receiveDeletion', {
        conversation: msg.sender,
        ...jsonMsg,
      })
    return res.apiStatus({
      conversation: msg.recipient,
      ...jsonMsg,
    })
  }

  res.apiStatus('error: no message', 404)
})

router.post('/readAll/', authToken, async (req: UserRequest, res: any) => {
  if (!req?.body?.sender) return res.apiStatus('error: no sender', 404)

  const updated: [number, any] = await models.Message.update(
    {
      isread: true,
    },
    {
      where: {
        recipient: req.user.id,
        sender: req.body.sender,
        isread: false,
      },
    },
  )

  res.apiStatus(updated[0] + ' messages updated')
})

router.post('/message/', authToken, async (req: UserRequest, res: any) => {
  if (!req?.body?.recipient) return res.apiStatus('error: no recipient', 404)
  if (!req?.body?.message) return res.apiStatus('error: no message', 404)
  if (req.body.recipient == req.user.id)
    return res.apiStatus('error: sending message to oneself', 500)

  const content: string = req.body.message
  const recipientSocket: any = self.socket?.get(req.body.recipient) as any

  models.Message.update(
    {
      isread: 1,
    },
    {
      where: {
        recipient: req.user.id,
        sender: req.body.recipient,
      },
    },
  ).then((v: [number, any]) => {
    console.log(v[0] + 'messages')
  })

  const addedMessage: any = await models.Message.create({
    id: null,
    sender: req.user.id,
    recipient: req.body.recipient,
    date: sequelize.fn('NOW'),
    content,
    isread: 0,
  })

  const message: any = await models.Message.findByPk(addedMessage.id, {
    include: [
      { as: 'recipient_user', model: models.User },
      { as: 'sender_user', model: models.User },
    ],
  })

  if (recipientSocket)
    recipientSocket.emit('conversations/receiveMessage', message)

  res.apiStatus(message)
})

router.get('*', (req: Request, res: any) => {
  res.send('Route Conversation')
})

const self = {
  router,
  socket: null as ChatServer | null,
}

export default self
