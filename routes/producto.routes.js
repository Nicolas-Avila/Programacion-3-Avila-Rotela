const express = require("express");
const router = express.Router();
const Producto = require("../entity/producto.entity.js");

// Ruta: localhost:3000/productos/
router.get("/", (req, res) => {
    res.send("Estoy en el router de productos");
});

// Crear producto
router.post("/crear", async (req, res) => {
    try {
        const { nombreProducto, descripcionProducto, imgSrc, precioProducto, eliminado } = req.body;

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
            eliminado,
        });

        res.status(201).json(nuevoProducto); // Devolver el producto creado
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).json({ error: "Error al crear el producto" });
    }
});

// Mostrar todos los productos no eliminados
router.get("/productos", async (req, res) => {
    try {
        const resultado = await Producto.findAll({
            where: { eliminado: false }
        });
        res.send(resultado);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send({ error: "Error al obtener productos" });
    }
});

// Mostrar todos los productos con los eliminados
router.get("/todosIncluidos", async (req, res) => {
    try {
        const resultado = await Producto.findAll();
        res.send(resultado);
    } catch (error) {
        console.error("Error al obtener todos los productos:", error);
        res.status(500).send({ error: "Error al obtener productos" });
    }
});

// Actualizar un producto
router.put("/actualizar/:id", async (req, res) => {
    try {
        const producto = await Producto.findOne({
            where: { id: req.params.id }
        });

        if (!producto) {
            return res.status(404).json({ error: true, message: "Producto no encontrado" });
        }

        // Actualización del producto
        await Producto.update(req.body, {
            where: { id: req.params.id}
        });

        const productoActualizado = await Producto.findOne({
            where: { id: req.params.id}
        });

        res.json({ success: true, producto: productoActualizado });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

// Baja lógica
router.delete("/quitar/:id", async (req, res) => {
    const resultado = await Producto.update(
        { eliminado: true },
        { where: { id: req.params.id } }
    );
    res.send(resultado);
});

// Restaurar un producto (cambiar eliminado a false)
router.put("/restaurar/:id", async (req, res) => {
    try {
        const producto = await Producto.findOne({
            where: { id: req.params.id }
        });

        if (!producto) {
            return res.status(404).json({ error: true, message: "Producto no encontrado" });
        }

        // Restaurar el producto
        await Producto.update(
            { eliminado: false },  // Cambiar el estado eliminado a false
            { where: { id: req.params.id } }
        );

        const productoRestaurado = await Producto.findOne({
            where: { id: req.params.id }
        });

        res.json({ success: true, producto: productoRestaurado });
    } catch (error) {
        console.error("Error al restaurar el producto:", error);
        res.status(500).json({ error: "Error al restaurar el producto" });
    }
});


module.exports = router;
