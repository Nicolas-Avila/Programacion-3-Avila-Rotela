const express = require("express");
const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

require("dotenv").config(); // Asegúrate de cargar las variables de entorno

// toma los datos del body
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Conexión DB
const sequelize = require("../db/sequelize");
const ProductoSequelize = require("../entity/producto.entity.js");

// Sincronizar modelos con la base de datos
sequelize.sync()
    .then(() => {
        console.log("¡Tablas sincronizadas correctamente!");
    })
    .catch((error) => {
        console.error("Error al sincronizar las tablas:", error);
    });

// Rutas
const productosRoutes = require("../routes/producto.routes.js");
app.use("/productos", productosRoutes);

// Iniciar servidor
app.listen(process.env.PORT, () => {
    console.log("Inicio la app en el puerto", process.env.PORT);
    console.log("Contraseña de MySQL:", process.env.MYSQL_PASSWORD);
});
