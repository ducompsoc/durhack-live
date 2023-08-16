import config from "config";
import mysql, { ConnectionOptions as MySqlConnectionOptions } from "mysql2/promise";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";

import { mysql_options_schema } from "@/common/config_schema";

import User from "./user";


const databaseConnectOptions = mysql_options_schema.parse(config.get("mysql.data"));

export async function ensureDatabaseExists() {
  const initialConnectOptions = databaseConnectOptions as MySqlConnectionOptions;
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

const sequelizeConnectOptions = databaseConnectOptions as SequelizeOptions;
sequelizeConnectOptions.dialect = "mysql";

const sequelize = new Sequelize(sequelizeConnectOptions);

sequelize.addModels([
  User,
]);

export default sequelize;
