const sequelize = require("../db/sequelize");
const { DataTypes } = require("sequelize");

const VentasSequelize = sequelize.define(
    "Ventas",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        nombre: {           // Nuevo campo agregado
            type: DataTypes.STRING,
            allowNull: false,  // Puedes cambiar esto a true si quieres permitir valores nulos
        },
        apellido: {         // Nuevo campo agregado
            type: DataTypes.STRING,
            allowNull: false,
        },
        dni: {              // Nuevo campo agregado
            type: DataTypes.STRING,
            allowNull: false,
        },
        telefono: {         // Nuevo campo agregado
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        createdAt: "creado_en",
    }
);

module.exports = VentasSequelize;
