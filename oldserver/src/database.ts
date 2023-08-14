import { DataTypes, Sequelize } from 'sequelize';
import config from 'config';

export const sequelize = new Sequelize({
  host: config.get('mysql.host'),
  database: config.get('mysql.name'),
  username: config.get('mysql.user'),
  password: config.get('mysql.pass'),
  dialect: 'mysql',
});
