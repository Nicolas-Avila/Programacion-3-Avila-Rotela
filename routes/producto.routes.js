const express = require("express");
const router = express.Router();
const Producto = require("../entity/producto.entity.js"); // Asegúrate de que el path es correcto

// Ruta: localhost:3000/productos/
router.get("/", (req, res) => {
    res.send("Estoy en el router de productos");
});

router.post("/", async (req, res) => {
    try {
        // Tomar los datos del body
        const { nombreProducto, descripcionProducto, imgSrc, precioProducto } = req.body;

        // Validación del precio
        if (precioProducto <= 0) {
            return res.status(400).send({ error: true, message: "El precio debe ser mayor a 0" });
        }

        // Crear el producto en la base de datos
        const nuevoProducto = await Producto.create({
            nombreProducto,
            descripcionProducto,
            imgSrc,
            precioProducto,
        });

        res.status(201).json(nuevoProducto); // Devolver el producto creado
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).json({ error: "Error al crear el producto" });
    }
});

module.exports = router;
