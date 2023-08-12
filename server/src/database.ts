import { DataTypes, Model, Sequelize } from 'sequelize';
import { get } from 'config';

export const sequelize = new Sequelize({
    host: get('mysql.host'),
    database: get('mysql.name'),
    username: get('mysql.user'),
    password: get('mysql.pass'),
    dialect: 'mysql',
});

export class User extends Model {
    public id!: number;
    public email!: string;
    public hashed_password!: Buffer | null;
    public password_salt!: Buffer | null;
    public preferredName!: string;
    public fullName!: string;
    public role!: string | null;
    public verifyCode!: string | null;
    public verifySentAt!: Date | null;
    public initiallyLoggedInAt!: Date | null;
    public lastLoggedInAt!: Date | null;
    public age!: number | null;
    public phoneNumber!: string | null;
    public university!: string | null;
    public graduationYear!: string | null;
    public ethnicity!: string | null;
    public gender!: string | null;
    public hUKMarketing!: boolean | null;
    public hUKConsent!: boolean | null;
    public checkedIn!: boolean | null;
    public discordId!: string | null;
    public discordName!: string | null;
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