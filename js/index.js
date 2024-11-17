const express = require("express");
const app = express();
const path = require("path");


// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../html')));

// Middleware para permitir CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Cargar variables de entorno
require("dotenv").config();

// Middleware para parsear JSON
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Conexión a la base de datos
const sequelize = require("../db/sequelize");
const ProductoSequelize = require("../entity/producto.entity.js");

// Sincronizar la base de datos
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

// Ruta principal que renderiza la vista con los productos
app.get("/tienda", (req, res) => {
    // Aquí deberías obtener los productos de la base de datos
    ProductoSequelize.findAll({ where: { eliminado: false }})
        .then(productos => {
            res.render('tienda', { productos });
        })
        .catch(error => {
            console.error("Error al obtener productos:", error);
            res.status(500).send("Error al cargar productos");
        });
});


// Iniciar servidor
app.listen(process.env.PORT, () => {
    console.log("Inicio la app en el puerto", process.env.PORT);
    console.log("Contraseña de MySQL:", process.env.MYSQL_PASSWORD);
});
