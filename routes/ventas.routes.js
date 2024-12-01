const express = require("express");
const router = express.Router();
const XLSX = require('xlsx');
const VentasSequelize = require("../entity/ventas.entity");

router.post("/nueva", async (req, res) => {
    const { nombre, apellido, dni, telefono, fecha, total } = req.body;

    try {
        // Verifica que los campos adicionales estén siendo recibidos
        console.log("Datos recibidos:", req.body);  // Esto es para depuración

        // Crear la venta con los nuevos campos
        const nuevaVenta = await VentasSequelize.create({
            nombre,      // Se agregan los campos
            apellido,    // Se agregan los campos
            dni,         // Se agregan los campos
            telefono,    // Se agregan los campos
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

router.get('/descargar', async (req, res) => {
    try {
        // Obtener todas las ventas de la base de datos
        const ventas = await VentasSequelize.findAll();
        
        // Convertir las ventas a un formato que pueda ser exportado como Excel
        const ventasData = ventas.map(venta => ({
            ID: venta.id,
            Nombre: venta.nombre,
            Apellido: venta.apellido,
            DNI: venta.dni,
            Telefono: venta.telefono,
            Fecha: venta.fecha,
            Total: venta.total
        }));

        // Crear un libro de trabajo de Excel
        const ws = XLSX.utils.json_to_sheet(ventasData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Ventas');

        // Generar el archivo Excel y enviarlo como respuesta
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        // Configurar las cabeceras de respuesta para que el navegador descargue el archivo
        res.setHeader('Content-Disposition', 'attachment; filename=ventas.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Enviar el archivo como respuesta
        res.send(excelBuffer);

    } catch (error) {
        console.error("Error al generar el archivo Excel:", error);
        res.status(500).json({
            message: "Ocurrió un error al generar el archivo Excel"
        });
    }
});

module.exports = router;
