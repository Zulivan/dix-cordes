/* eslint-disable require-jsdoc */
import _sequelize from 'sequelize'
const DataTypes = _sequelize.DataTypes
import _Message from './message.js'
import _Status from './status.js'
import _User from './user.js'

export default function initModels(sequelize) {
  const Message = _Message.init(sequelize, DataTypes)
  const Status = _Status.init(sequelize, DataTypes)
  const User = _User.init(sequelize, DataTypes)

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
