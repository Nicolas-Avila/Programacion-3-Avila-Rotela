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

    const validateAdminData = (req, res, next) => {
        const { nombre, password } = req.body;
    
        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({ error: "El nombre del administrador es obligatorio" });
        }
    
        if (!password || password.length < 6) {
            return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
        }
    
        next();  // Continúa con la ejecución de la ruta si pasa la validación
    };
    
    // Middleware de registro de solicitudes
    const logRequest = (req, res, next) => {
        console.log(`Solicitud recibida: ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
        next();
    };
    

    // Crear administrador
    router.post("/crear",validateAdminData,logRequest, async (req, res) => {
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

    // Ruta de autenticación
router.post("/login", async (req, res) => {
    try {
        const { nombre, password } = req.body;
        const admin = await Admin.findOne({ where: { nombre } });

        if (admin && admin.password === password) {
            res.status(200).json({ success: true, message: "Autenticación exitosa" });
        } else {
            res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al autenticar administrador" });
    }
});


    module.exports = router;
