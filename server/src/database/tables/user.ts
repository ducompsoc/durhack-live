import { Model, DataType, Table, Column, HasMany } from "sequelize-typescript";
import { Op } from "sequelize";
import { Ethnicity, Gender, UserRole } from "@/common/model_enums";

import OAuthUser from "./oauth_user";

@Table
export default class User extends Model {
  @Column({
    field: "user_id",
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.BLOB("tiny"),
    allowNull: true,
  })
  declare hashed_password: Buffer | null;

  @Column({
    type: DataType.BLOB("tiny"),
    allowNull: true,
  })
  declare password_salt: Buffer | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare preferred_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare full_name: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.hacker,
    allowNull: false,
  })
  declare role: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare verify_code: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare verify_sent_at: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare initially_logged_in_at: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare last_logged_in_at: Date | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare age: number | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare phone_number: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare university: string | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare graduation_year: number | null;

  @Column({
    type: DataType.ENUM(...Object.values(Ethnicity)),
    allowNull: true,
  })
  declare ethnicity: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(Gender)),
    allowNull: true,
  })
  declare gender: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare h_UK_marketing: boolean | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare h_UK_consent: boolean | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare checked_in: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare discord_id: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare discord_name: string | null;

  @HasMany(() => OAuthUser, "user_id")
  declare oauth_logins: OAuthUser[];
  
  static async findOneByEmail(email: string, rejectOnEmpty: boolean | Error = false): Promise<User> {
    let augmentedEmail = [email];

    if (email.endsWith("@dur.ac.uk") || email.endsWith("@durham.ac.uk")) {
      const [prefix] = email.split("@");

      augmentedEmail = [`${prefix}@dur.ac.uk`, `${prefix}@durham.ac.uk`];
    }

    return await User.findOne({
      where: {
        email: { [Op.or]: augmentedEmail },
      },
      rejectOnEmpty: rejectOnEmpty,
    });
  }
}