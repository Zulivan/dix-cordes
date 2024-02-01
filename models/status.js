/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
import _sequelize from 'sequelize'
const { Model } = _sequelize

export default class Status extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(40),
          allowNull: true,
        },
        color: {
          type: DataTypes.STRING(40),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'status',
        schema: 'messagerie',
        timestamps: false,
        indexes: [
          {
            name: 'status_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    )
  }
}
