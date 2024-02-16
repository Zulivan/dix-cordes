import { Model, DataTypes, Sequelize } from 'sequelize'

interface StatusAttributes {
  id: number
  name: string | null
  color: string | null
}

class Status extends Model<StatusAttributes> {
  public id!: number
  public name!: string | null
  public color!: string | null

  public static initModel(sequelize: Sequelize): any {
    return Status.init(
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
      },
    )
  }
}

export default Status
