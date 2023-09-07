import { Model, DataType, Table, Column, HasMany } from "sequelize-typescript";
import { hashText, randomBytesAsync } from "@/auth/hashed_secrets";

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
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

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
    allowNull: true,
  })
  declare access_token_lifetime: number | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare refresh_token_lifetime: number | null;

  @Column({
    type: DataType.BLOB("tiny"),
    allowNull: true,
  })
  declare hashed_secret: Buffer;

  @Column({
    type: DataType.BLOB("tiny"),
    allowNull: true,
  })
  declare secret_salt: Buffer;

  @HasMany(() => OAuthUser, "client_id")
  declare users: OAuthUser[];

  async updateSecret(newSecret: string): Promise<void> {
    this.secret_salt = await randomBytesAsync(16);
    this.hashed_secret = await hashText(newSecret, this.secret_salt);
    await this.save();
  }
}
