import { Model, DataType, Table, Column } from "sequelize-typescript";
import { Ethnicity, Gender, UserRole } from "../common/model_enums";

@Table
export default class User extends Model {
  @Column({
    field: "user_id",
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email!: string;

  @Column({
    type: DataType.BLOB("tiny"),
    allowNull: true,
  })
  declare hashed_password!: Buffer | null;

  @Column({
    type: DataType.BLOB("tiny"),
    allowNull: true,
  })
  declare password_salt!: Buffer | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare preferredName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare fullName!: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.hacker,
    allowNull: false,
  })
  declare role!: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare verifyCode!: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare verifySentAt!: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare initiallyLoggedInAt!: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare lastLoggedInAt!: Date | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare age!: number | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare phoneNumber!: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare university!: string | null;

  @Column({
    type: DataType.CHAR(4),
    allowNull: true,
  })
  declare graduationYear!: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(Ethnicity)),
    allowNull: true,
  })
  declare ethnicity!: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(Gender)),
    allowNull: true,
  })
  declare gender!: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare hUKMarketing!: boolean | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare hUKConsent!: boolean | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare checkedIn!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare discordId!: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare discordName!: string | null;
}