const express = require("express");
const app = express();
const path = require("path");

// ===========================
// Configuración de EJS
// ===========================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../html')));

// ===========================
// Configuración de Middleware
// ===========================

// Middleware para parsear JSON
const bodyParser = require("body-parser");
app.use(bodyParser.json());

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

// ===========================
// Configuración de Variables de Entorno
// ===========================
require("dotenv").config();

// ===========================
// Conexión a la Base de Datos
// ===========================
const sequelize = require("../db/sequelize");
const ProductoSequelize = require("../entity/producto.entity.js");
const AdminSequelize = require("../entity/admin.entity.js");

// Sincronizar la base de datos
sequelize.sync()
    .then(() => {
        console.log("¡Tablas sincronizadas correctamente!");
    })
    .catch((error) => {
        console.error("Error al sincronizar las tablas:", error);
    });

// ===========================
// Definición de Rutas
// ===========================

// Importación de rutas de productos
const productosRoutes = require("../routes/producto.routes.js");
app.use("/productos", productosRoutes);

// Importación de rutas de admin
const adminRoutes = require("../routes/admin.routes.js");
app.use("/admin", adminRoutes);


// Ruta principal que renderiza la vista con los productos
app.get("/tienda", (req, res) => {
    ProductoSequelize.findAll({ where: { eliminado: false }})
        .then(productos => {
            res.render('tienda', { productos });
        })
        .catch(error => {
            console.error("Error al obtener productos:", error);
            res.status(500).send("Error al cargar productos");
        });
});

// ===========================
// Inicio del Servidor
// ===========================
app.listen(process.env.PORT, () => {
    console.log("Inicio la app en el puerto", process.env.PORT);
    console.log("Contraseña de MySQL:", process.env.MYSQL_PASSWORD);
});
