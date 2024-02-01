import bcrypt from 'bcrypt'
import models from '../../model.js'
import { isNicknameUsed } from '../methods/utils.js'

/** comparePasswords
 * @param {string} param1 Mot de passe 1
 * @param {string} param2 Mot de passe 2
 * @return {void}
 */
async function comparePasswords(param1, param2) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(param1, param2, function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

/** Créer un utilisateur en BDD
 * @param {object} info Colonnes à mettre en BDD
 * @return {object}
 */
async function createUser(info) {
  if (!info || !info?.nickname) throw Error('Missing nickname')
  if (!info || !info?.password) throw Error('Missing password')

  const final = {
    id: null,
    nickname: 'USER',
    fname: 'ABC',
    lname: 'EFG',
    motd: 'Je suis nouveau sur Dix-Cordes',
    status: 1,
    peerjsrelay: '',
    socketrelay: '',
    ...info,
    password: await bcrypt.hash(info.password, 10),
  }

  const [isNicknameAlreadyUsed] = await isNicknameUsed(info.nickname)

  if (isNicknameAlreadyUsed) throw Error('nickname already used')

  const user = await models.User.create(final)

  return user
}

/** loginUser
 * @param {string} username Pseudo
 * @param {string} password Mot de passe
 * @return {object} utilisateur
 */
async function loginUser(username, password) {
  const [isNicknameAlreadyUsed, userList] = await isNicknameUsed(username)

  if (!isNicknameAlreadyUsed) throw Error('unkownAccount')

  const user = userList[0]

  const verifiedPass = await comparePasswords(password, user.password)

  if (!verifiedPass) throw Error('wrongPassword')

  return user
}

export { createUser, loginUser }
