import { Model, DataTypes, Sequelize } from 'sequelize'

export interface UserAttributes {
  id: number
  nickname: string | null
  fname: string | null
  lname: string | null
  password: string | null
  motd: string | null
  status: number | null
  image: string | null
  peerjsrelay: string | null
  socketrelay: string | null
}

class User extends Model<UserAttributes> {
  public id!: number
  public nickname!: string | null
  public fname!: string | null
  public lname!: string | null
  public password!: string | null
  public motd!: string | null
  public status!: number | null
  public image!: string | null
  public peerjsrelay!: string | null
  public socketrelay!: string | null

  public static initModel(sequelize: Sequelize): any {
    return User.init(
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
        peerjsrelay: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        socketrelay: {
          type: DataTypes.TEXT,
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
      },
    )
  }
}

export default User
