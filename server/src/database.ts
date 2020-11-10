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
    public password!: string | null;
    public firstName!: string;
    public lastName!: string;
    public role!: string | null;
    public verifyCode!: string | null;
    public verifySentAt!: Date | null;
    public initiallyLoggedInAt!: Date | null;
    public lastLoggedInAt!: Date | null;
}

User.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
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
    },
    {
        tableName: 'users',
        sequelize,
    },
);