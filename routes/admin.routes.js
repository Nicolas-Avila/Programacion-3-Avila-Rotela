const express = require("express");
const router = express.Router();
const Admin = require("../entity/admin.entity.js");

// Obtener todos los administradores
router.get("/", async (req, res) => {
    try {
        const admins = await Admin.findAll();
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener administradores" });
    }
});

// Crear administrador
router.post("/crear", async (req, res) => {
    try {
        const { nombre, password } = req.body;
        const nuevoAdmin = await Admin.create({ nombre, password });
        res.status(201).json(nuevoAdmin);
    } catch (error) {
        res.status(500).json({ error: "Error al crear administrador" });
    }
});

// Actualizar administrador
router.put("/actualizar/:id", async (req, res) => {
    try {
        const { nombre, password } = req.body;
        await Admin.update({ nombre, password }, { where: { id: req.params.id } });
        res.json({ success: true, message: "Administrador actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar administrador" });
    }
});

// Eliminar administrador
router.delete("/eliminar/:id", async (req, res) => {
    try {
        await Admin.destroy({ where: { id: req.params.id } });
        res.json({ success: true, message: "Administrador eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar administrador" });
    }
});

module.exports = router;
