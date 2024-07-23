import mysql from "mysql2/promise"
import { Sequelize } from "sequelize-typescript"

import { databaseConfig } from "@/config"

import { User, OAuthUser, OAuthClient } from "./tables"

export async function ensureDatabaseExists() {
  const { database: databaseName, username: user, ...connectOptions } = databaseConfig.data

  if (!databaseName) {
    throw new Error("Database name cannot be null!")
  }

  const connection = await mysql.createConnection({user, ...connectOptions})

  await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`)

  connection.destroy()
}

const sequelize = new Sequelize({
  dialect: "mysql",
  ...databaseConfig.data
})

sequelize.addModels([User, OAuthClient, OAuthUser])

export default sequelize
