import models from '../../model'
import { UserAttributes } from '../../models/user'

/** Si le nom est déjà utilisé par un autre utilisateur
 * @param {string} nickname nickname
 * @return {Promise<[boolean, User[]]>}
 */
async function isNicknameUsed(
  nickname: string,
): Promise<[boolean, UserAttributes[]]> {
  const list = await models.User.findAll({
    raw: false,
    where: {
      nickname,
    },
  })
  return [list.length > 0, list]
}

export { isNicknameUsed }
