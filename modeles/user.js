/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
import _sequelize from 'sequelize'
const { Model } = _sequelize
export default class User extends Model {
  // eslint-disable-next-line require-jsdoc
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        nickname: {
          type: DataTypes.STRING(40),
          allowNull: true,
        },
        fname: {
          type: DataTypes.STRING(40),
          allowNull: true,
        },
        lname: {
          type: DataTypes.STRING(40),
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        motd: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        image: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'user',
        schema: 'messagerie',
        timestamps: false,
        indexes: [
          {
            name: 'user_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    )
  }
}
