const express = require("express");
const router = express.Router();
const Producto = require("../model/producto.js");

// Ruta: localhost:3000/productos/
router.get("/", (req, res) => {
    res.send("Estoy en el router de productos");
});

router.post("/", (req, res) => {
    // Tomar los datos del body
    const nombreProducto = req.body.nombreProducto;
    const descripcionProducto = req.body.descripcionProducto;
    const imgSrc = req.body.imgSrc;
    const precioProducto = req.body.precioProducto;

    // Crear un producto
    const producto = new Producto();
    producto.nombreProducto = nombreProducto;
    producto.descripcionProducto = descripcionProducto;
    producto.imgSrc = imgSrc;
    producto.precioProducto = precioProducto;

    // Validación del precio
    if (precioProducto <= 0) {
        res.status(400).send({ error: true, message: "El precio debe ser mayor a 0" });
    } else {
        res.status(200).send(producto); // Enviar el producto directamente
    }
});

module.exports = router;
