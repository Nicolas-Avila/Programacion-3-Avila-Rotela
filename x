formularioPago.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('Apellido').value;
    const dni = document.getElementById('dni').value;
    const telefono = document.getElementById('telefono').value;

    // Guardar la información en el localStorage
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('apellido', apellido);
    localStorage.setItem('dni', dni);
    localStorage.setItem('telefono', telefono);

    // Calcular el total del carrito
    const total = carrito.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);

    // Crear el objeto de datos
    const datosVenta = {
        nombre,      // Asegúrate de enviar estos campos
        apellido,    // Asegúrate de enviar estos campos
        dni,         // Asegúrate de enviar estos campos
        telefono,    // Asegúrate de enviar estos campos
        fecha: new Date().toISOString(),
        total
    };

    try {
        // Enviar los datos al servidor
        const respuesta = await fetch('/ventas/nueva', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosVenta),  // Los datos se deben enviar aquí
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            alert('Compra registrada con éxito');
            localStorage.removeItem('carrito'); // Limpiar el carrito
            window.location.href = '/factura'; // Redirigir a la página de la factura
        } else {
            alert('Error al registrar la compra: ' + resultado.message);
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Ocurrió un error al procesar la compra.');
    }
});