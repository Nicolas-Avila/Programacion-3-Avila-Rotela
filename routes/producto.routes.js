const express = require("express");
const router = express.Router();
const Producto = require("../entity/producto.entity.js"); // Asegúrate de que el path es correcto

// Ruta: localhost:3000/productos/
router.get("/", (req, res) => {
    res.send("Estoy en el router de productos");
});
//crear producto
router.post("/crear", async (req, res) => {
    try {
        // Tomar los datos del body
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
//mostrar todo que no este eliminado logicamente
router.get("/mostrar", async (req, res) => {
    const resultado = await Producto.findAll({
        where: { eliminado: false },
    });
    res.send(resultado);
});
//muestra un producto que no este eliminado logicamente
// router.get("/mostrar/:id", async (req, res) => {
//     const resultado = await Producto.findOne({
//         where: { id: req.params.id, eliminado: false },
//     });
//     res.send(resultado);
// });

//actualiza un producto
router.put("/actualizar/:id", async (req, res) => {
    const resultado = await Producto.update(
        {
            ...req.body,
        },
        {
            where: {
                id: req.params.id,
                eliminado: false,
            },
        }
    );
    res.send(resultado);
});

// Baja lógica
router.delete("/quitar/:id", async (req, res) => {
    const resultado = Producto.update(
        { eliminado: true },
        { where: { id: req.params.id } }
    );
    res.send(resultado);
});

module.exports = router;
