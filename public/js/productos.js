document.addEventListener('DOMContentLoaded', () => {
    // =======================
    // Mostrar el nombre del usuario en el encabezado
    // =======================
    const nombreUsuario = localStorage.getItem('nombreUsuario'); 
    const nombreUsuarioSpan = document.getElementById('nombreUsuarioBienvenida'); 

    if (nombreUsuario && nombreUsuarioSpan) {
        nombreUsuarioSpan.textContent = nombreUsuario;
    } else {
        nombreUsuarioSpan.textContent = "Visitante";
    }

    let carrito = JSON.parse(localStorage.getItem('carrito')) || []; 

    // Función para actualizar la visualización del carrito
    function actualizarCarrito() {
        const carritoContainer = document.getElementById('carrito');
        carritoContainer.innerHTML = '';

        if (carrito.length === 0) {
            carritoContainer.innerHTML = '<p>Tu carrito está vacío</p>';
        } else {
            // Itera sobre los productos en el carrito y los muestra
            carrito.forEach((producto, index) => {
                const itemCarrito = document.createElement('div');
                itemCarrito.classList.add('carrito-item');
                itemCarrito.innerHTML = `
                    <div class="carrito-item-info">
                        <p><strong>Producto: ${producto.nombre}</strong></p>
                        <p>$${producto.precio} x ${producto.cantidad}</p>
                    </div>
                `;

                // Botón para eliminar 1 unidad del producto
                const botonEliminar = document.createElement('button');
                botonEliminar.classList.add('btn', 'btn-danger', 'btn-sm');
                botonEliminar.innerHTML = '<i class="fas fa-minus"></i>';
                botonEliminar.addEventListener('click', () => {
                    eliminarDelCarrito(index);
                });
                itemCarrito.appendChild(botonEliminar);

                // Botón para eliminar completamente el producto
                const botonEliminarCompleto = document.createElement('button');
                botonEliminarCompleto.classList.add('btn', 'btn-warning', 'btn-sm');
                botonEliminarCompleto.innerHTML = '<i class="fas fa-trash"></i>';
                botonEliminarCompleto.addEventListener('click', () => {
                    eliminarProductoCompleto(index); 
                });
                itemCarrito.appendChild(botonEliminarCompleto);

                // Botón para agregar una unidad del producto
                const botonAgregar = document.createElement('button');
                botonAgregar.classList.add('btn', 'btn-primary', 'btn-sm');
                botonAgregar.innerHTML = '<i class="fas fa-plus"></i>';
                botonAgregar.addEventListener('click', () => {
                    agregarAlCarrito(producto.nombre, producto.precio, producto.imagen); 
                });
                itemCarrito.appendChild(botonAgregar);

                carritoContainer.appendChild(itemCarrito);
            });

            // Calcula y muestra el total del carrito
            const total = carrito.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
            const totalHTML = document.createElement('div');
            totalHTML.classList.add('carrito-total');
            totalHTML.innerHTML = `<p><strong>Total: $${total}</strong></p>`;
            carritoContainer.appendChild(totalHTML);

            // Botón para finalizar la compra
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
            productoExistente.cantidad += 1; 
        } else {
            carrito.push({ nombre, precio, cantidad: 1, imagen }); 
        }
        actualizarCarrito();
    }

    // Función para eliminar 1 unidad de un producto
    function eliminarDelCarrito(index) {
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad -= 1; // Reduce la cantidad si es mayor a 1
        } else {
            carrito.splice(index, 1); // Elimina el producto si solo queda 1
        }
        actualizarCarrito();
    }

    // Función para eliminar completamente un producto del carrito
    function eliminarProductoCompleto(index) {
        carrito.splice(index, 1); 
        actualizarCarrito();
    }

    // Asignar eventos a los botones de "Agregar al carrito"
    const botonesAgregar = document.querySelectorAll('.agregar');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const nombreProducto = e.target.getAttribute('data-nombre');
            const precioProducto = parseFloat(e.target.getAttribute('data-precio'));
            const imagenProducto = e.target.getAttribute('data-imagen');
            agregarAlCarrito(nombreProducto, precioProducto, imagenProducto);
        });
    });

    // Formulario de pago y envío de datos al servidor
    const formularioPago = document.getElementById('formularioPago');
    formularioPago.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('Apellido').value;
        const dni = document.getElementById('dni').value;
        const telefono = document.getElementById('telefono').value;

        // Guardar información del cliente en localStorage
        localStorage.setItem('nombre', nombre);
        localStorage.setItem('apellido', apellido);
        localStorage.setItem('dni', dni);
        localStorage.setItem('telefono', telefono);

        const total = carrito.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
        const datosVenta = { nombre, apellido, dni, telefono, fecha: new Date().toISOString(), total };

        try {
            const respuesta = await fetch('/ventas/nueva', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosVenta),
            });

            if (respuesta.ok) {
                window.location.href = '/factura'; 
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
        }
    });

    // Función para cerrar sesión
    document.getElementById("cerrarSesionBtn").addEventListener("click", function() {
        localStorage.clear(); 
        window.location.href = "/"; 
    });

    actualizarCarrito();
});


function EvaluarAdmin() {
    window.location.href = "http://127.0.0.1:5500/html/loginAdmin.html";
}

// Función para validar el nombre del usuario y redirigir
function EvaluarUsuario() {
    const nombre = document.getElementById("nombreUsuario").value;
    if (nombre) {
        localStorage.setItem('nombreUsuario', nombre);
        window.location.href = "/tienda"; 
    } else {
        alert("Por favor ingresa tu nombre.");
    }
}
