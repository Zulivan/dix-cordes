// @ts-ignore
import aes256 from 'aes256'
import { Model, DataTypes, Sequelize } from 'sequelize'

export interface MessageAttributes {
  id: number
  sender: number | null
  recipient: number | null
  date: Date | null
  content: string
  isread: boolean | null
}

class Message extends Model<MessageAttributes> {
  public id!: number
  public sender!: number | null
  public recipient!: number | null
  public date!: Date | null
  public content!: string
  public isread!: boolean | null

  public static initModel(sequelize: Sequelize): any {
    return this.init(
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
          get() {
            if (!this.getDataValue('content')) return ''
            return aes256.decrypt(
              process.env.AES_KEY,
              this.getDataValue('content'),
            )
          },
          set(value: string) {
            this.setDataValue(
              'content',
              aes256.encrypt(process.env.AES_KEY, value),
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
      },
    )
  }
}

export default Message
