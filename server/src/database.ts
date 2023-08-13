import { DataTypes, Model, Sequelize } from 'sequelize';
import config from 'config';

export const sequelize = new Sequelize({
  host: config.get('mysql.host'),
  database: config.get('mysql.name'),
  username: config.get('mysql.user'),
  password: config.get('mysql.pass'),
  dialect: 'mysql',
});

export class User extends Model {
  declare id!: number;
  declare email!: string;
  declare hashed_password!: Buffer | null;
  declare password_salt!: Buffer | null;
  declare preferredName!: string;
  declare fullName!: string;
  declare role!: string | null;
  declare verifyCode!: string | null;
  declare verifySentAt!: Date | null;
  declare initiallyLoggedInAt!: Date | null;
  declare lastLoggedInAt!: Date | null;
  declare age!: number | null;
  declare phoneNumber!: string | null;
  declare university!: string | null;
  declare graduationYear!: string | null;
  declare ethnicity!: string | null;
  declare gender!: string | null;
  declare hUKMarketing!: boolean | null;
  declare hUKConsent!: boolean | null;
  declare checkedIn!: boolean | null;
  declare discordId!: string | null;
  declare discordName!: string | null;
}

User.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hashed_password: {
          type: DataTypes.BLOB('tiny'),
          allowNull: true,
        },
        password_salt: {
          type: DataTypes.BLOB('tiny'),
          allowNull: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        preferredName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        verifyCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        verifySentAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        initiallyLoggedInAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        lastLoggedInAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        university: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        graduationYear: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        ethnicity: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        hUKMarketing: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: null,
        },
        hUKConsent: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: null,
        },
        checkedIn: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        discordId: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        discordName: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        tableName: 'users',
        sequelize,
    },
);