const express = require("express");
const router = express.Router();
const Admin = require("../entity/admin.entity.js");
const crypto = require("crypto");

// =======================
// Función para generar un hash de contraseña
// =======================
const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.createHmac("sha256", salt) 
        .update(password) 
        .digest("hex"); 

    return { salt, hash };
};

// =======================
// Ruta para obtener todos los administradores
// =======================
router.get("/", async (req, res) => { 
    try {
        const admins = await Admin.findAll();
        const adminArray = admins.map(admin => admin.toJSON());
        res.json(adminArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener administradores" });
    }
});

// =======================
// Middleware para validar datos del administrador
// =======================
const validateAdminData = (req, res, next) => {
    const { nombre, password } = req.body;

    // Verifica si el nombre está presente y no está vacío
    if (!nombre || nombre.trim() === "") {
        return res.status(400).json({ error: "El nombre del administrador es obligatorio" });
    }

    // Verifica que la contraseña tenga al menos 6 caracteres
    if (!password || password.length < 6) {
        return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    next();
};

// =======================
// Middleware para registrar solicitudes
// =======================
const logRequest = (req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
    next(); 
};

// =======================
// Ruta para crear un administrador
// =======================
router.post("/crear", validateAdminData, logRequest, async (req, res) => {
    try {
        const { nombre, password } = req.body;

        // Genera el hash y el salt para la contraseña
        const { salt, hash } = hashPassword(password);

        const nuevoAdmin = await Admin.create({ nombre, password: hash, salt });

        res.status(201).json(nuevoAdmin);
    } catch (error) {
        res.status(500).json({ error: "Error al crear administrador" });
    }
});

// =======================
// Ruta para actualizar un administrador
// =======================
router.put("/actualizar/:id", async (req, res) => {
    try {
        const { nombre, password } = req.body;

        // Genera un nuevo hash y salt para la nueva contraseña
        const { salt, hash } = hashPassword(password);

        await Admin.update({ nombre, password: hash, salt }, { where: { id: req.params.id } });
        res.json({ success: true, message: "Administrador actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar administrador" });
    }
});

// =======================
// Ruta para eliminar un administrador
// =======================
router.delete("/eliminar/:id", async (req, res) => {
    try {
        await Admin.destroy({ where: { id: req.params.id } });
        res.json({ success: true, message: "Administrador eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar administrador" });
    }
});

// =======================
// Función para validar una contraseña
// =======================
const validatePassword = (inputPassword, storedHash, storedSalt) => {
    // Genera un hash de la contraseña ingresada usando el salt almacenado
    const inputHash = crypto.createHmac("sha256", storedSalt)
        .update(inputPassword)
        .digest("hex");
    
    return inputHash === storedHash;
};

// =======================
// Ruta para autenticar un administrador (login)
// =======================
router.post("/login", async (req, res) => {
    try {
        const { nombre, password } = req.body;

        const admin = await Admin.findOne({ where: { nombre } });

        if (admin) {
            // Valida la contraseña proporcionada
            if (validatePassword(password, admin.password, admin.salt)) {
                res.status(200).json({ success: true, message: "Autenticación exitosa" });
            } else {
                res.status(401).json({ success: false, message: "Credenciales incorrectas" });
            }
        } else {
            res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al autenticar administrador" });
    }
});

module.exports = router;
