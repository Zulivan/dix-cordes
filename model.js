import { Sequelize } from 'sequelize'
import initModels from './modeles/init-models.js'
import config from 'config'

const confBD = config.get('bd')

const sequelize = new Sequelize(
  confBD.nomBase,
  confBD.utilisateur,
  confBD.passe,
  {
    host: confBD.hote,
    port: confBD.port,
    schema: confBD.schema,
    dialect: 'postgres',
    logging: confBD.logging,
  }
)

export default initModels(sequelize)
