import express from 'express'
import sequelize from 'sequelize'

import { authToken } from '../../jwt.js'
import conversation from '../methods/conversation.js'
import models from '../../model.js'

// eslint-disable-next-line new-cap
const router = express.Router({ mergeParams: true })

router.get('/list', authToken, async (req, res) => {
  const output = await conversation.getAll(req.user.id)

  res.apiStatus(output)
})

router.post('/messages', authToken, async (req, res) => {
  if (!req?.body?.sender) return res.apiStatus('error: no sender', 404)

  const output = await conversation.messages(req.body.sender, req.user.id)

  res.apiStatus(output)
})

router.delete('/messages', authToken, async (req, res) => {
  if (!req?.body?.id) return res.apiStatus('error: no id', 404)

  const msg = await conversation.getMessage(req.body.id)

  const del = await conversation.deleteMessage(req.body.id, req.user.id)

  if (del == 1) {
    const jsonMsg = msg.dataValues

    const recipientSocket = self.socket.get(jsonMsg.recipient)

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

router.post('/readAll/', authToken, async (req, res) => {
  if (!req?.body?.sender) return res.apiStatus('error: no sender', 404)

  const updated = await models.Message.update(
    {
      isread: true,
    },
    {
      where: {
        recipient: req.user.id,
        sender: req.body.sender,
        isread: false,
      },
    }
  )

  res.apiStatus(updated + ' messages updated')
})

router.post('/message/', authToken, async (req, res) => {
  if (!req?.body?.recipient) return res.apiStatus('error: no recipient', 404)
  if (!req?.body?.message) return res.apiStatus('error: no message', 404)
  if (req.body.recipient == req.user.id)
    return res.apiStatus('error: sending message to oneself', 500)

  const content = req.body.message
  const recipientSocket = self.socket.get(req.body.recipient)

  models.Message.update(
    {
      isread: 1,
    },
    {
      where: {
        recipient: req.user.id,
        sender: req.body.recipient,
      },
    }
  ).then((v) => {
    console.log(v + 'messages')
  })

  const addedMessage = await models.Message.create({
    id: null,
    sender: req.user.id,
    recipient: req.body.recipient,
    date: sequelize.fn('NOW'),
    content,
    isread: 0,
  })

  const message = await models.Message.findByPk(addedMessage.id, {
    include: [
      { as: 'recipient_user', model: models.User },
      { as: 'sender_user', model: models.User },
    ],
  })

  if (recipientSocket)
    recipientSocket.emit('conversations/receiveMessage', message)

  res.apiStatus(message)
})

router.get('*', (req, res) => {
  res.send('Route Conversation')
})

const self = {
  router,
  socket: null,
}

export default self
