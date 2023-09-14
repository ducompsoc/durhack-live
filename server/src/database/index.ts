import config from "config";
import mysql, { ConnectionOptions as MySqlConnectionOptions } from "mysql2/promise";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";

import { mysql_options_schema, sequelize_options_schema } from "@/common/schema/config";

import {
  User,
  OAuthUser,
  OAuthClient,
} from "./tables";


export async function ensureDatabaseExists() {
  const initialConnectOptions = mysql_options_schema.parse(config.get("mysql.data")) as MySqlConnectionOptions;
  const database_name = initialConnectOptions.database;

  if (!database_name) {
    throw new Error("Database name cannot be null!");
  }

  delete initialConnectOptions.database;
  const connection = await mysql.createConnection(initialConnectOptions);

  await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${database_name}\`;`);

  await connection.destroy();
}

const sequelizeConnectOptions = sequelize_options_schema.parse(config.get("mysql.data")) as SequelizeOptions;

const sequelize = new Sequelize(sequelizeConnectOptions);

sequelize.addModels([
  User,
  OAuthClient,
  OAuthUser
]);

export default sequelize;
