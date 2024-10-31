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
process.loadEnvFile();

//toma los datos del body
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Conexión DB
const sequelize = require("../db/sequelize");
const productosequelize = require("../entity/producto.entity.js");

const productosRoutes = require("../routes/producto.routes.js");
app.use("/productos", productosRoutes);



app.listen(process.env.PORT, () => {
    console.log("inicio la app");
    console.log(process.env.MYSQL_PASSWORD);
})