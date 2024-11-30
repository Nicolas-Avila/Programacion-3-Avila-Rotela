document.addEventListener('DOMContentLoaded', () => {
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const nombreUsuarioSpan = document.getElementById('nombreUsuarioBienvenida');

    if (nombreUsuario && nombreUsuarioSpan) {
        nombreUsuarioSpan.textContent = nombreUsuario;
    } else {
        nombreUsuarioSpan.textContent = "Visitante";
    }
    // Recuperar el carrito desde localStorage (si existe)
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Función para actualizar el carrito en el sidebar
    function actualizarCarrito() {
        const carritoContainer = document.getElementById('carrito');
        carritoContainer.innerHTML = '';

        if (carrito.length === 0) {
            carritoContainer.innerHTML = '<p>Tu carrito está vacío</p>';
        } else {
            carrito.forEach((producto, index) => {
                const itemCarrito = document.createElement('div');
                itemCarrito.classList.add('carrito-item');
                itemCarrito.innerHTML = `
                <div class="carrito-item-info">
                        <p><strong>Producto: ${producto.nombre}</strong></p>
                        <p>$${producto.precio} x ${producto.cantidad}</p>
                    </div>
                `;
                
                // Crear el botón de eliminar 1 unidad con ícono de menos
                const botonEliminar = document.createElement('button');
                botonEliminar.classList.add('btn', 'btn-danger', 'btn-sm');
                botonEliminar.innerHTML = '<i class="fas fa-minus"></i>';  // Ícono de menos
                
                // Asignar el evento de clic para eliminar 1 unidad del producto
                botonEliminar.addEventListener('click', () => {
                    eliminarDelCarrito(index);
                });

                itemCarrito.appendChild(botonEliminar);

                // Crear el botón de eliminar completamente el producto con ícono de tacho de basura
                const botonEliminarCompleto = document.createElement('button');
                botonEliminarCompleto.classList.add('btn', 'btn-warning', 'btn-sm');
                botonEliminarCompleto.innerHTML = '<i class="fas fa-trash"></i>';  // Ícono de tacho de basura
                
                // Asignar el evento de clic para eliminar el producto completo del carrito
                botonEliminarCompleto.addEventListener('click', () => {
                    eliminarProductoCompleto(index);
                });

                itemCarrito.appendChild(botonEliminarCompleto);

                // Crear el botón de agregar +1 con ícono de más
                const botonAgregar = document.createElement('button');
                botonAgregar.classList.add('btn', 'btn-primary', 'btn-sm');
                botonAgregar.innerHTML = '<i class="fas fa-plus"></i>';  // Ícono de más
                
                // Asignar el evento de clic para aumentar la cantidad del producto
                botonAgregar.addEventListener('click', () => {
                    agregarAlCarrito(producto.nombre, producto.precio, producto.imagen);
                });

                itemCarrito.appendChild(botonAgregar);

                carritoContainer.appendChild(itemCarrito);
            });

            const total = carrito.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
            const totalHTML = document.createElement('div');
            totalHTML.classList.add('carrito-total');
            totalHTML.innerHTML = `<p><strong>Total: $${total}</strong></p>`;
            carritoContainer.appendChild(totalHTML);

            // Agregar botón "Finalizar compra" si hay productos
            const botonFinalizar = document.createElement('button');
            botonFinalizar.textContent = 'Finalizar compra';
            botonFinalizar.classList.add('btn', 'btn-success');
            botonFinalizar.addEventListener('click', () => {
                const modal = new bootstrap.Modal(document.getElementById('compraModal'));
                modal.show();
            });
            carritoContainer.appendChild(botonFinalizar);
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Función para agregar un producto al carrito
    function agregarAlCarrito(nombre, precio, imagen) {
        const productoExistente = carrito.find(producto => producto.nombre === nombre);
        if (productoExistente) {
            // Si el producto ya está en el carrito, aumentar la cantidad
            productoExistente.cantidad += 1;
        } else {
            // Si no está, agregarlo con cantidad 1 y la imagen
            carrito.push({ nombre, precio, cantidad: 1, imagen });
        }
        actualizarCarrito();
    }

    // Función para eliminar 1 unidad del producto del carrito
    function eliminarDelCarrito(index) {
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad -= 1;
        } else {
            carrito.splice(index, 1);
        }
        actualizarCarrito();
    }

    // Función para eliminar completamente el producto del carrito
    function eliminarProductoCompleto(index) {
        carrito.splice(index, 1);
        actualizarCarrito();
    }

    // Asignar eventos a los botones de agregar al carrito
    const botonesAgregar = document.querySelectorAll('.agregar');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const nombreProducto = e.target.getAttribute('data-nombre');
            const precioProducto = parseFloat(e.target.getAttribute('data-precio'));
            const imagenProducto = e.target.getAttribute('data-imagen');
            agregarAlCarrito(nombreProducto, precioProducto, imagenProducto);
        });
    });

// Función para almacenar la información de pago y enviarla a la ruta de la factura
const formularioPago = document.getElementById('formularioPago');
formularioPago.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener los valores del formulario (si el formulario es usado)
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('Apellido').value;
    const dni = document.getElementById('dni').value;
    const telefono = document.getElementById('telefono').value;

    // Guardar la información en el localStorage
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('apellido', apellido);
    localStorage.setItem('dni', dni);
    localStorage.setItem('telefono', telefono);

    // Redirigir a la página de la factura
    window.location.href = '/factura';
});

    document.getElementById("cerrarSesionBtn").addEventListener("click", function() {
        localStorage.clear(); 
        window.location.href = "/"; 
    });



    actualizarCarrito();
});

function EvaluarAdmin() {
    window.location.href = "http://127.0.0.1:5500/html/loginAdmin.html";
}

function EvaluarUsuario() {
        const nombre = document.getElementById("nombreUsuario").value;
        if (nombre) {
            localStorage.setItem('nombreUsuario', nombre);
            window.location.href = "/tienda";
        } else {
            alert("Por favor ingresa tu nombre.");
        }

}
