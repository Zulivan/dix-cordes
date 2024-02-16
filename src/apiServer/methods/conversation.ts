import { Op } from 'sequelize'
import models from '../../model'
import { MessageAttributes } from '../../models/message'

/** Récupère toutes les conversations
 * @param {number} userId ID
 * @return {Promise<MessageAttributes[]>}
 */
function getAll(userId: number): Promise<MessageAttributes[]> {
  // Get all conversations
  return models.Message.findAll({
    raw: false,
    where: {
      [Op.or]: [{ recipient: userId }, { sender: userId }],
    },
    include: [
      { as: 'recipient_user', model: models.User },
      { as: 'sender_user', model: models.User },
    ],
  })
}

/** Récupère les messages d'une conversation
 * @param {number} id Message
 * @param {number} initiator Personne qui supprime
 * @return {Promise<number>}
 */
async function deleteMessage(id: number, initiator: number): Promise<number> {
  try {
    return await models.Message.destroy({ where: { id, sender: initiator } })
  } catch (err) {
    return 0
  }
}

/** Récupère les messages d'une conversation
 * @param {number} id Message
 * @return {Promise<Message>}
 */
async function getMessage(id: number): Promise<MessageAttributes | null> {
  try {
    return await models.Message.findOne({
      where: {
        id,
      },
    })
  } catch (err) {
    return null
  }
}

/** Get all messages between two users
 * @param {number} sender Who sent the message
 * @param {number} recipient Who received the message
 * @return {Promise<MessageAttributes[]>}
 */
async function messages(
  sender: number,
  recipient: number,
): Promise<MessageAttributes[]> {
  try {
    return await models.Message.findAll({
      raw: false,
      where: {
        [Op.or]: [
          { recipient, sender },
          { sender: recipient, recipient: sender },
        ],
      },
      include: [
        { as: 'recipient_user', model: models.User },
        { as: 'sender_user', model: models.User },
      ],
    })
  } catch (err) {
    return []
  }
}

export default { messages, getAll, deleteMessage, getMessage }
