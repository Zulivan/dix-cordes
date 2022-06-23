import sequelize from 'sequelize'
import models from '../../model.js'

/** Récupère toutes les conversations
 * @param {string} userId ID
 * @return {void}
 */
function getAll(userId) {
  return 'ok'
}

/** Récupère les messages d'une conversation
 * @param {int} id Message
 * @param {int} initiator Personne qui supprime
 * @return {void}
 */
async function deleteMessage(id, initiator) {
  try {
    return await models.Message.destroy({ where: { id, sender: initiator } })
  } catch (err) {
    return err
  }
}

/** Récupère les messages d'une conversation
 * @param {int} id Message
 * @return {void}
 */
async function getMessage(id) {
  try {
    return await models.Message.findOne({
      where: {
        id,
      },
    })
  } catch (err) {
    return err
  }
}

/** Récupère les messages d'une conversation
 * @param {string} sender Envoyeur
 * @param {string} recipient Receveur
 * @return {void}
 */
async function messages(sender, recipient) {
  try {
    return await models.Message.findAll({
      raw: false,
      where: {
        [sequelize.Op.or]: [
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
    return err
  }
}

export default { messages, getAll, deleteMessage, getMessage }
