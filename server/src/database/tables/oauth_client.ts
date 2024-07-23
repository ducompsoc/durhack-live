import { hashText, randomBytesAsync } from "@/auth/hashed-secrets"
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript"

import OAuthUser from "./oauth_user"

@Table
export default class OAuthClient extends Model {
  @Column({
    field: "client_id",
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
  })
  declare id: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string

  @Column({
    type: DataType.JSON,
    defaultValue: [],
  })
  declare grants: string[]

  @Column({
    type: DataType.JSON,
    defaultValue: [],
  })
  declare allowedScopes: string[]

  @Column({
    type: DataType.JSON,
    defaultValue: [],
  })
  declare redirectUris: string[]

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare accessTokenLifetime: number | undefined

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare refreshTokenLifetime: number | undefined

  @Column({
    type: DataType.BLOB("tiny"),
    allowNull: true,
  })
  declare hashedSecret: Buffer

  @Column({
    type: DataType.BLOB("tiny"),
    allowNull: true,
  })
  declare secretSalt: Buffer

  @HasMany(() => OAuthUser, "client_id")
  declare users: Awaited<OAuthUser>[]

  async updateSecret(newSecret: string): Promise<void> {
    this.secretSalt = await randomBytesAsync(16)
    this.hashedSecret = await hashText(newSecret, this.secretSalt)
    await this.save()
  }
}
