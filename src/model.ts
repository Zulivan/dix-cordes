import { Sequelize } from 'sequelize'
import initModels from './models/init-models'
import config from 'config'

interface DatabaseConfig {
  schema: string
  logging: boolean
}

const confBD: DatabaseConfig = config.get('bd')

const databaseURL: string = process.env.DATABASE_URL || 'undefined database url'

const sequelize = new Sequelize(databaseURL, {
  schema: confBD.schema,
  dialect: 'postgres',
  ssl: databaseURL.includes('sslmode=disable') ? false : true,
  dialectOptions: {
    ssl: {
      require: databaseURL.includes('sslmode=disable') ? false : true,
      rejectUnauthorized: false,
    },
  },
  logging: confBD.logging,
})

export default initModels(sequelize)
