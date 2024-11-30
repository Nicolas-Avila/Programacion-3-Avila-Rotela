window.addEventListener("DOMContentLoaded", function () {
    // Obtener los datos del usuario desde localStorage
    const nombre = localStorage.getItem('nombre') || 'Sin nombre';
    const apellido = localStorage.getItem('apellido') || 'Sin apellido';
    const dni = localStorage.getItem('dni') || 'Sin DNI';
    const telefono = localStorage.getItem('telefono') || 'Sin teléfono';
    
    // Mostrar los datos del usuario en la factura
    document.getElementById('nombre').textContent = nombre;
    document.getElementById('apellido').textContent = apellido;
    document.getElementById('dni').textContent = dni;
    document.getElementById('telefono').textContent = telefono;

    // Obtener el carrito desde localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productosCarritoDiv = document.getElementById("productos-carrito");
    const totalDiv = document.getElementById("total");
    
    // Si el carrito está vacío
    if (carrito.length === 0) {
        productosCarritoDiv.innerHTML = '<p>No hay productos en el carrito.</p>';
        totalDiv.innerHTML = ''; // Si no hay productos, no mostrar el total
    } else {
        let total = 0;
        
        // Limpiar el contenido anterior de la factura
        productosCarritoDiv.innerHTML = ''; 
        
        // Mostrar los productos del carrito
        carrito.forEach(item => {
            // Asegurarse de que el precio sea un número válido
            const precio = parseFloat(item.precio);
            const cantidad = item.cantidad || 1;  // Usar la cantidad, por defecto 1 si no está definida
            
            // Verificar que el precio sea válido
            if (!isNaN(precio)) {
                // Insertar el producto tantas veces como su cantidad
                for (let i = 0; i < cantidad; i++) {
                    total += precio; // Sumar el precio por cada unidad

                    // Insertar el producto en la factura
                    productosCarritoDiv.insertAdjacentHTML('beforeend', `
                        <div class="producto">
                            <span><strong>${item.nombre}</strong>: $${precio}</span>
                        </div>
                    `);
                }
            } else {
                console.error("Precio no válido:", item);
            }
        });

        // Mostrar el total en la factura
        totalDiv.innerHTML = `
            <strong>Total: $${total.toFixed(2)}</strong>
        `;
    }

    // Agregar el evento al botón para evitar la llamada inline
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

