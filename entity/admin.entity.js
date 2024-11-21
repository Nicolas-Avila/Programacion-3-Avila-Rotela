const sequelize = require("../db/sequelize");
const { DataTypes } = require("sequelize");

const AdminSequelize = sequelize.define(
    "Admin",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        timestamps: true,
        createdAt: "creado_en",
    }
);

module.exports = AdminSequelize;
