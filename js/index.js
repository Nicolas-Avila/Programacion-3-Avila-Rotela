const express = require("express");
const app = express();
const path = require("path");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../html')));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Middleware para habilitar CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

require("dotenv").config();

// ===========================
// Conexión a la Base de Datos
// ===========================
const sequelize = require("../db/sequelize");
const ProductoSequelize = require("../entity/producto.entity.js");
const AdminSequelize = require("../entity/admin.entity.js");
const VentasSequelize = require("../entity/ventas.entity.js");

// Sincroniza las tablas en la base de datos
sequelize.sync()
    .then(() => {
        console.log("¡Tablas sincronizadas correctamente!");
    })
    .catch((error) => {
        console.error("Error al sincronizar las tablas:", error);
    });

// Rutas relacionadas con los productos
const productosRoutes = require("../routes/producto.routes.js");
app.use("/productos", productosRoutes);

// Rutas relacionadas con los administradores
const adminRoutes = require("../routes/admin.routes.js");
app.use("/admin", adminRoutes);

// Rutas relacionadas con las ventas
const ventasRoutes = require("../routes/ventas.routes.js");
app.use("/ventas", ventasRoutes);

// Ruta raíz que renderiza la página principal
app.get('/', (req, res) => {
    res.render('index', { publicUrl: '/public' });
});

// Ruta que renderiza la tienda, clasificando los productos por tipo
app.get("/tienda", (req, res) => {
    ProductoSequelize.findAll({ where: { eliminado: false } })
        .then(productos => {
            // Clasifica los productos por tipo
            const hardware = productos.filter(producto => producto.tipo === "hardware");
            const software = productos.filter(producto => producto.tipo === "software");

            res.render("tienda", { hardware, software });
        })
        .catch(error => {
            console.error("Error al obtener productos:", error);
            res.status(500).send("Error al cargar productos");
        });
});

// Ruta para generar una factura desde un formulario
app.post('/factura', (req, res) => {
    const { nombre, apellido, dni, telefono } = req.body;
    res.render('factura', { nombre, apellido, dni, telefono });
});

// Ruta para mostrar la factura con datos pasados por query params
app.get('/factura', (req, res) => {
    const nombre = req.query.nombre || 'Sin nombre';
    const apellido = req.query.apellido || 'Sin apellido';
    const dni = req.query.dni || 'Sin DNI';
    const telefono = req.query.telefono || 'Sin teléfono';

    res.render('factura', { nombre, apellido, dni, telefono });
});

// Inicia el servidor en el puerto especificado en las variables de entorno
app.listen(process.env.PORT, () => {
    console.log("Inicio la app en el puerto", process.env.PORT);
    console.log("Contraseña de MySQL:", process.env.MYSQL_PASSWORD);
});
