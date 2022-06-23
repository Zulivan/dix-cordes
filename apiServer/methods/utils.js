import models from '../../model.js'

/** Si le nom est déjà utilisé par un autre utilisateur
 * @param {string} nickname nickname
 * @return {object}
 */
async function isNicknameUsed(nickname) {
  const list = await models.User.findAll({
    raw: false,
    where: {
      nickname,
    },
  })
  return [list.length > 0, list]
}

export { isNicknameUsed }
