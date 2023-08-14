import config from "config";
import mysql, { ConnectionOptions } from "mysql2/promise";
import {Sequelize, SequelizeOptions} from "sequelize-typescript";

import User from "./user";


export async function ensureDatabaseExists() {
  const initialConnectOptions = config.get("mysql.data") as ConnectionOptions;
  const database_name = initialConnectOptions.database;

  if (!database_name) {
    throw new Error("Database name cannot be null!");
  }

  delete initialConnectOptions.database;
  const connection = await mysql.createConnection(initialConnectOptions);

  await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${database_name}\`;`);

  await connection.destroy();

  const otherConnectOptions = config.get("mysql.data");
  console.log(otherConnectOptions);
}

const sequelizeConnectOptions = config.get("mysql.data") as SequelizeOptions;
sequelizeConnectOptions.dialect = "mysql";

const sequelize = new Sequelize(sequelizeConnectOptions);

sequelize.addModels([
  User,
]);

export default sequelize;
