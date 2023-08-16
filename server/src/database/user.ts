import { Model, DataType, Table, Column } from "sequelize-typescript";
import { Op } from "sequelize";
import { Ethnicity, Gender, UserRole } from "@/common/model_enums";

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
    email!: string;

  @Column({
    type: DataType.BLOB("tiny"),
    allowNull: true,
  })
    hashed_password!: Buffer | null;

  @Column({
    type: DataType.BLOB("tiny"),
    allowNull: true,
  })
    password_salt!: Buffer | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    preferredName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    fullName!: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.hacker,
    allowNull: false,
  })
    role!: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    verify_code!: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
    verify_sent_at!: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
    initially_logged_in_at!: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
    last_logged_in_at!: Date | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
    age!: number | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    phoneNumber!: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    university!: string | null;

  @Column({
    type: DataType.CHAR(4),
    allowNull: true,
  })
    graduationYear!: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(Ethnicity)),
    allowNull: true,
  })
    ethnicity!: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(Gender)),
    allowNull: true,
  })
    gender!: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
    hUKMarketing!: boolean | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
    hUKConsent!: boolean | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
    checkedIn!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    discordId!: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    discordName!: string | null;
  
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