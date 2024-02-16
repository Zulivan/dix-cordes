import bcrypt from 'bcrypt'
import models from '../../model.js'
import { isNicknameUsed } from './utils'
import { UserAttributes } from '../../models/user.js'

/** Compare two passwords that are hashed
 * @param {string} param1 First password
 * @param {string} param2 Second password
 * @return {Promise<boolean>}
 */
async function comparePasswords(
  param1: string,
  param2: string,
): Promise<boolean> {
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

interface CreateUserAttributes {
  username: string
  password: string
}

/** Create a new user in the database
 * @param {CreateUserAttributes} info Combination of a username and a password
 * @return {Promise<UserAttributes>} user
 */
async function createUser(info: CreateUserAttributes): Promise<UserAttributes> {
  if (!info || !info?.username) throw Error('missingUsername')
  if (!info || !info?.password) throw Error('missingPassword')

  let final = {
    nickname: info.username,
    fname: 'ABC',
    lname: 'EFG',
    motd: 'Hello World!',
    status: 1,
    peerjsrelay: '',
    socketrelay: '',
    password: (await bcrypt.hash(info.password, 10)) as string,
  } as UserAttributes

  const [isUsernameAlreadyUsed] = await isNicknameUsed(final.nickname as string)
  if (isUsernameAlreadyUsed) throw Error('usernameAlreadyTaken')

  const user = await models.User.create(final)
  console.log('user', user)
  return user
}

/** loginUser
 * @param {string} username Pseudo
 * @param {string} password Mot de passe
 * @return {Promise<object>} utilisateur
 */
async function loginUser(username: string, password: string): Promise<object> {
  const [isNicknameAlreadyUsed, userList] = await isNicknameUsed(username)

  if (!isNicknameAlreadyUsed || userList.length === 0)
    throw Error('unknownAccount')

  const user = userList[0] as UserAttributes

  const verifiedPass = await comparePasswords(password, user.password as string)

  if (!verifiedPass) throw Error('wrongPassword')

  return user
}

export { createUser, loginUser }
