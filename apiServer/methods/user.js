// import sequelize from 'sequelize'
import models from '../../model.js'

/** Met à hiyr ke statys d'un utilisateur
 * @param {int} id Utilisateur
 * @param {object} updateInfo Infos à maodifier
 * @return {void}
 */
async function updateStatus(id, updateInfo) {
  try {
    return await models.User.update(updateInfo, {
      where: {
        id: id,
      },
    })
  } catch (err) {
    return err
  }
}

/** Info user
 * @param {object} id Id
 * @return {object}
 */
async function getUserById(id) {
  const user = await models.User.findByPk(id, {
    attributes: {
      exclude: ['fname', 'lname', 'password'],
    },
    include: [
      {
        model: models.Status,
        as: 'status_object',
      },
    ],
  })
  return user
}

export { updateStatus, getUserById }
