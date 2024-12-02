// ===========================
// Código para gestionar la factura del cliente
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Obtener datos del cliente desde localStorage
    const nombre = localStorage.getItem('nombre') || 'No disponible';
    const apellido = localStorage.getItem('apellido') || 'No disponible'; 
    const dni = localStorage.getItem('dni') || 'No disponible';
    const telefono = localStorage.getItem('telefono') || 'No disponible';

    // Mostrar los datos del cliente en la factura
    document.getElementById('nombre').innerText = nombre; 
    document.getElementById('apellido').innerText = apellido; 
    document.getElementById('dni').innerText = dni;
    document.getElementById('telefono').innerText = telefono;

    // =======================
    // Obtener el carrito desde localStorage
    // =======================
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const carritoContainer = document.getElementById('productos-carrito');
    
    // Verificar si el carrito está vacío
    if (carrito.length === 0) {
        carritoContainer.innerHTML = '<tr><td colspan="4">No hay productos en el carrito.</td></tr>';
    } else {
        carritoContainer.innerHTML = '';

        // Iterar sobre los productos en el carrito y agregarlos a la tabla
        carrito.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.nombre}</td> <!-- Nombre del producto -->
                <td>${producto.cantidad}</td> <!-- Cantidad del producto -->
                <td>$${producto.precio.toFixed(2)}</td> <!-- Precio unitario con 2 decimales -->
                <td>$${(producto.precio * producto.cantidad).toFixed(2)}</td> <!-- Precio total por cantidad -->
            `;
            carritoContainer.appendChild(row);
        });

        // =======================
        // Calcular el total del carrito
        // =======================
        const total = carrito.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td colspan="3"><strong>Total</strong></td> <!-- Celda que ocupa 3 columnas -->
            <td><strong>$${total.toFixed(2)}</strong></td> <!-- Total formateado -->
        `;
        carritoContainer.appendChild(totalRow); 
    }
});

// ===========================
// Función para guardar la factura como PDF
// ===========================
function guardar() {
    console.log("Función guardar llamada");
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

// Función para regresar a la página principal
function regresar() {
    localStorage.clear(); 
    window.location.href = "/";
}
