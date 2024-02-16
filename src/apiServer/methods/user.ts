import { Model, UpdateOptions, FindOptions } from 'sequelize'
import models from '../../model'

interface UpdateInfo {
  // Add properties for updateInfo object
}

interface UserInstance extends Model {
  // Add properties for User model
}

interface StatusInstance extends Model {
  // Add properties for Status model
}

/** Updates user information
 * @param {number} id - User ID
 * @param {UpdateInfo} updateInfo - Data to update
 * @return {Promise<number>}
 */
async function updateStatus(id: number, updateInfo: UpdateInfo): Promise<any> {
  try {
    await models.User.update(updateInfo, {
      where: {
        id: id,
      },
    })
    return 1
  } catch (err) {
    console.error(err)
    return 0
  }
}

/** Récupère les informations d'un utilisateur par son identifiant
 * @param {number} id - Identifiant de l'utilisateur
 * @return {Promise<UserInstance | null>}
 */
async function getUserById(id: number): Promise<UserInstance | null> {
  if (!id) return null
  if (typeof id !== 'number') return null
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
