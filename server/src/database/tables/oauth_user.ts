import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript"

import OAuthClient from "./oauth_client"
import User from "./user"

@Table
export default class OAuthUser extends Model {
  @PrimaryKey
  @ForeignKey(() => OAuthClient)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare client_id: number

  @PrimaryKey
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare user_id: number

  @BelongsTo(() => User, "user_id")
  declare user: Awaited<User>

  @BelongsTo(() => OAuthClient, "client_id")
  declare client: Awaited<OAuthClient>

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare minimum_token_issue_time: Date | null

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare minimum_auth_code_issue_time: Date | null
}
