/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
import config from 'config'
import aes256 from 'aes256'
import _sequelize from 'sequelize'
const { Model } = _sequelize

export default class Message extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        sender: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'user',
            key: 'id',
          },
        },
        recipient: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'user',
            key: 'id',
          },
        },
        date: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        content: {
          type: DataTypes.STRING,
          allowNull: true,
          get: function () {
            if (!this.getDataValue('content')) return ''
            return aes256.decrypt(
              config.get('aeskey'),
              this.getDataValue('content')
            )
          },
          set: function (value) {
            this.setDataValue(
              'content',
              aes256.encrypt(config.get('aeskey'), value)
            )
          },
        },
        isread: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'message',
        schema: 'messagerie',
        timestamps: false,
        indexes: [
          {
            name: 'message_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    )
  }
}
