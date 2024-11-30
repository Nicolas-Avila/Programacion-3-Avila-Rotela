    const express = require("express");
    const router = express.Router();
    const Admin = require("../entity/admin.entity.js");
    const crypto = require("crypto");

    // Función para generar un hash de la contraseña
    const hashPassword = (password) => {
        const salt = crypto.randomBytes(16).toString("hex"); // Generar un salt aleatorio
        const hash = crypto.createHmac("sha256", salt) // Usamos SHA-256 para el hash
            .update(password) // Aplicamos el hash a la contraseña
            .digest("hex"); // Obtenemos el valor en formato hexadecimal
    
        return { salt, hash }; // Devolvemos el salt y el hash
    };

    // Obtener todos los administradores
    router.get("/", async (req, res) => { 
        try {
            const admins = await Admin.findAll();
            const adminArray = admins.map(admin => admin.toJSON()); // Convertir los resultados a JSON
            res.json(adminArray);  // Responde con un array de administradores
        } catch (error) {
            console.error(error);
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
    router.post("/crear", validateAdminData, logRequest, async (req, res) => {
        try {
            const { nombre, password } = req.body;
            
            // Hash de la contraseña
            const { salt, hash } = hashPassword(password);
    
            // Guardar el administrador con el hash y el salt
            const nuevoAdmin = await Admin.create({ nombre, password: hash, salt });
            
            res.status(201).json(nuevoAdmin);
        } catch (error) {
            res.status(500).json({ error: "Error al crear administrador" });
        }
    });
    

    // Actualizar administrador
    router.put("/actualizar/:id", async (req, res) => {
        try {
            const { nombre, password } = req.body;
    
            // Hash de la contraseña
            const { salt, hash } = hashPassword(password);
    
            // Actualizar el administrador con el nuevo hash y salt
            await Admin.update({ nombre, password: hash, salt }, { where: { id: req.params.id } });
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

    const validatePassword = (inputPassword, storedHash, storedSalt) => {
        // Hash de la contraseña ingresada con el salt almacenado
        const inputHash = crypto.createHmac("sha256", storedSalt)
            .update(inputPassword)
            .digest("hex");
        
        return inputHash === storedHash;
    };
    
    router.post("/login", async (req, res) => {
        try {
            const { nombre, password } = req.body;
            const admin = await Admin.findOne({ where: { nombre } });
    
            if (admin) {
                // Validar la contraseña
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
