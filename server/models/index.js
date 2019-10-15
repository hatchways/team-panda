const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: 'localhost',
      port: 5432,
      dialect: 'postgres'
    }
)

const models = {
  User: sequelize.import('./user')
}

export { sequelize };
export default models;
