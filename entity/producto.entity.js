const sequelize = require("../db/sequelize");
const { DataTypes } = require("sequelize");

const ProductoSequelize = sequelize.define(
    "Producto",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombreProducto: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcionProducto: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imgSrc: {
            type: DataTypes.STRING,
            allowNull: true,
        }, 
        precioProducto: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        tipo: {
            type: DataTypes.ENUM("hardware", "software"),
            allowNull: false,
        },
        eliminado: {
            defaultValue: false,
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        createdAt: "creado_en",
    }
);

module.exports = ProductoSequelize;
