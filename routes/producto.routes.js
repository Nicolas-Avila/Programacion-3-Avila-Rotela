const express = require("express");
const router = express.Router();
const Producto = require("../entity/producto.entity.js");
const upload = require("../storage/storage");

router.get("/", (req, res) => {
    res.send("Estoy en el router de productos");
});

// =======================
// Middleware de validación de datos del producto
// =======================
const validateProductData = (req, res, next) => {
    const { nombreProducto, precioProducto } = req.body;

    // Valida que el nombre del producto no esté vacío
    if (!nombreProducto || nombreProducto.trim() === "") {
        return res.status(400).json({ error: "El nombre del producto es obligatorio" });
    }

    // Valida que el precio del producto sea mayor a 0
    if (precioProducto === undefined || precioProducto <= 0) {
        return res.status(400).json({ error: "El precio debe ser mayor a 0" });
    }

    next(); 
};

// =======================
// Middleware de validación del tipo de producto
// =======================
const validateTipo = (req, res, next) => {
    const { tipo } = req.body;

    if (!tipo || !["hardware", "software"].includes(tipo.toLowerCase())) {
        return res.status(400).json({
            error: "El campo tipo es obligatorio y debe ser 'hardware' o 'software'.",
        });
    }

    next();
};

// =======================
// Ruta para crear un producto con imagen
// =======================
router.post("/crear", upload.single("imgSrc"), validateProductData, validateTipo, async (req, res) => {
    try {
        const { nombreProducto, descripcionProducto, precioProducto, tipo } = req.body;

        // `req.file` contiene los datos del archivo cargado (imagen)
        const imgSrc = req.file ? `/uploads/${req.file.filename}` : null;

        if (!imgSrc) {
            return res.status(400).json({ error: "La imagen es obligatoria" });
        }

        const nuevoProducto = await Producto.create({
            nombreProducto,
            descripcionProducto,
            precioProducto,
            tipo,
            imgSrc,
            eliminado: false,
        });

        res.status(201).json(nuevoProducto); 
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// =======================
// Ruta para actualizar un producto por su ID
// =======================
router.put("/actualizar/:id", upload.single('imgSrc'), validateTipo, async (req, res) => {
    try {
        const producto = await Producto.findOne({
            where: { id: req.params.id },  
        });

        if (!producto) {
            return res.status(404).json({ error: true, message: "Producto no encontrado" });
        }

        const { nombreProducto, descripcionProducto, precioProducto, tipo } = req.body;
        let imgSrc = producto.imgSrc; 

        if (req.file) {
            imgSrc = '/uploads/' + req.file.filename; 
        }

        await producto.update({
            nombreProducto,
            descripcionProducto,
            imgSrc,
            precioProducto,
            tipo,
        });

        res.json({ success: true, producto }); 
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

// =======================
// Ruta para obtener productos no eliminados
// =======================
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

// =======================
// Ruta para obtener todos los productos, incluyendo los eliminados
// =======================
router.get("/todosIncluidos", async (req, res) => {
    try {
        const resultado = await Producto.findAll();
        res.send(resultado);  
    } catch (error) {
        console.error("Error al obtener todos los productos:", error);
        res.status(500).send({ error: "Error al obtener productos" });
    }
});

// =======================
// Ruta para realizar una baja lógica (marcar como eliminado) de un producto
// =======================
router.delete("/quitar/:id", async (req, res) => {
    try {
        const resultado = await Producto.update(
            { eliminado: true },
            { where: { id: req.params.id } }
        );

        res.send(resultado); 
    } catch (error) {
        console.error("Error al quitar el producto:", error);
        res.status(500).json({ error: "Error al quitar el producto" });
    }
});

// =======================
// Ruta para restaurar un producto (cambiar eliminado a false)
// =======================
router.put("/restaurar/:id", async (req, res) => {
    try {
        const producto = await Producto.findOne({
            where: { id: req.params.id }
        });

        if (!producto) {
            return res.status(404).json({ error: true, message: "Producto no encontrado" });
        }

        await Producto.update(
            { eliminado: false },
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
