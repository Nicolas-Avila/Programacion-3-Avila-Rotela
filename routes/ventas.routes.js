const express = require("express");
const router = express.Router();
const XLSX = require('xlsx');  
const VentasSequelize = require("../entity/ventas.entity"); 

// =======================
// Ruta para registrar una nueva venta
// =======================
router.post("/nueva", async (req, res) => {
    const { nombre, apellido, dni, telefono, fecha, total } = req.body; 

    try {
        console.log("Datos recibidos:", req.body);  

        const nuevaVenta = await VentasSequelize.create({
            nombre,
            apellido,
            dni,
            telefono,
            fecha: fecha || new Date(), 
            total      
        });

        res.status(201).json({
            message: "Venta registrada con éxito",
            venta: nuevaVenta,
        });
    } catch (error) {
        console.error("Error al registrar la venta:", error); 
        res.status(500).json({
            message: "Ocurrió un error al registrar la venta", 
        });
    }
});

// =======================
// Ruta para descargar todas las ventas como archivo Excel
// =======================
router.get('/descargar', async (req, res) => {
    try {
        const ventas = await VentasSequelize.findAll();
        
        // Transformar las ventas en un formato adecuado para Excel
        const ventasData = ventas.map(venta => ({
            ID: venta.id,
            Nombre: venta.nombre,
            Apellido: venta.apellido,
            DNI: venta.dni,
            Telefono: venta.telefono,
            Fecha: venta.fecha,
            Total: venta.total
        }));

        // Crear una hoja de trabajo de Excel a partir de los datos de ventas
        const ws = XLSX.utils.json_to_sheet(ventasData);  
        const wb = XLSX.utils.book_new();  
        XLSX.utils.book_append_sheet(wb, ws, 'Ventas'); 

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Disposition', 'attachment; filename=ventas.xlsx'); 
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');  

        res.send(excelBuffer);

    } catch (error) {
        console.error("Error al generar el archivo Excel:", error);
        res.status(500).json({
            message: "Ocurrió un error al generar el archivo Excel" 
        });
    }
});

module.exports = router;
