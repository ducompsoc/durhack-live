import { Model, DataType, Table, Column, HasMany } from "sequelize-typescript";

import OAuthUser from "./oauth_user";

@Table
export default class OAuthClient extends Model {
  @Column({
    field: "client_id",
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.JSON,
    defaultValue: [],
  })
  declare grants: string[];

  @Column({
    type: DataType.JSON,
    defaultValue: [],
  })
  declare allowed_scopes: string[];

  @Column({
    type: DataType.JSON,
    defaultValue: [],
  })
  declare redirect_uris: string[];

  @Column({
    type: DataType.INTEGER,
  })
  declare access_token_lifetime: number;

  @Column({
    type: DataType.INTEGER,
  })
  declare refresh_token_lifetime: number;

  @Column({
    type: DataType.BLOB("tiny"),
  })
  declare hashed_secret: Buffer;

  @Column({
    type: DataType.BLOB("tiny"),
    allowNull: true,
  })
  declare secret_salt: Buffer;

  @HasMany(() => OAuthUser, "client_id")
  declare users: OAuthUser[];
}