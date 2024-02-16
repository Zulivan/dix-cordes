import { Sequelize } from 'sequelize'
import MessageModel from './message'
import StatusModel from './status'
import UserModel from './user'

export default function initModels(sequelize: Sequelize) {
  const Message = MessageModel.initModel(sequelize)
  const Status = StatusModel.initModel(sequelize)
  const User = UserModel.initModel(sequelize)

  User.belongsTo(Status, { as: 'status_object', foreignKey: 'status' })
  Status.hasMany(User, { as: 'users', foreignKey: 'status' })
  Message.belongsTo(User, { as: 'recipient_user', foreignKey: 'recipient' })
  User.hasMany(Message, { as: 'messages', foreignKey: 'recipient' })
  Message.belongsTo(User, { as: 'sender_user', foreignKey: 'sender' })
  User.hasMany(Message, { as: 'sender_messages', foreignKey: 'sender' })

  return {
    Message,
    Status,
    User,
  }
}
