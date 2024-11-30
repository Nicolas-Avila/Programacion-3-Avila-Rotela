document.addEventListener('DOMContentLoaded', () => {
    // Obtener los datos del cliente desde localStorage
    const nombre = localStorage.getItem('nombre') || 'No disponible';
    const apellido = localStorage.getItem('apellido') || 'No disponible';
    const dni = localStorage.getItem('dni') || 'No disponible';
    const telefono = localStorage.getItem('telefono') || 'No disponible';

    // Mostrar los datos del cliente en la factura
    document.getElementById('nombre').innerText = nombre;
    document.getElementById('apellido').innerText = apellido;
    document.getElementById('dni').innerText = dni;
    document.getElementById('telefono').innerText = telefono;

    // Obtener el carrito desde localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Obtener el contenedor de la tabla de productos
    const carritoContainer = document.getElementById('productos-carrito');
    
    // Si el carrito está vacío, mostrar mensaje
    if (carrito.length === 0) {
        carritoContainer.innerHTML = '<tr><td colspan="4">No hay productos en el carrito.</td></tr>';
    } else {
        // Limpiar cualquier contenido previo
        carritoContainer.innerHTML = '';

        // Iterar sobre el carrito y agregar los productos a la tabla
        carrito.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>$${(producto.precio * producto.cantidad).toFixed(2)}</td>
            `;
            carritoContainer.appendChild(row);
        });

        // Calcular el total
        const total = carrito.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
        
        // Agregar el total al final de la tabla
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td colspan="3"><strong>Total</strong></td>
            <td><strong>$${total.toFixed(2)}</strong></td>
        `;
        carritoContainer.appendChild(totalRow);
    }
});

// Función para guardar la factura como PDF
function guardar() {
    console.log("Función guardar llamada");
    
    // Accede a jsPDF desde el objeto global
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();
    const elementoFactura = document.getElementById("factura");

    html2canvas(elementoFactura, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 180;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        doc.save("Factura.pdf");
    });
}

function regresar() {
    localStorage.clear();
    window.location.href = "/";
}

