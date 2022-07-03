import { Sequelize } from 'sequelize'
import initModels from './modeles/init-models.js'
import config from 'config'

const confBD = config.get('bd')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  use_env_variable: 'DATABASE_URL',
  schema: confBD.schema,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: confBD.logging,
})

export default initModels(sequelize)
