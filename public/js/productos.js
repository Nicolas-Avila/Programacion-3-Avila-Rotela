document.addEventListener('DOMContentLoaded', () => {
    // Recuperar el carrito desde localStorage (si existe)
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Función para actualizar el carrito en el sidebar
    function actualizarCarrito() {
        const carritoContainer = document.getElementById('carrito');
        carritoContainer.innerHTML = ''; // Limpiar el contenido

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
                
                // Crear el botón de eliminar
                const botonEliminar = document.createElement('button');
                botonEliminar.classList.add('btn', 'btn-danger', 'btn-sm');
                botonEliminar.textContent = 'Eliminar 1';
                
                // Asignar el evento de clic para eliminar 1 unidad del producto
                botonEliminar.addEventListener('click', () => {
                    eliminarDelCarrito(index);
                });

                // Agregar el botón de eliminar al contenedor del item
                itemCarrito.appendChild(botonEliminar);

                // Agregar el botón "Agregar al carrito" (en caso de que quieras permitir agregar más unidades)
                const botonAgregar = document.createElement('button');
                botonAgregar.classList.add('btn', 'btn-primary', 'btn-sm');
                botonAgregar.textContent = 'Agregar +1'; // Este botón agregará 1 más al carrito
                
                // Asignar el evento de clic para aumentar la cantidad del producto
                botonAgregar.addEventListener('click', () => {
                    agregarAlCarrito(producto.nombre, producto.precio, producto.imagen);
                });

                // Agregar el botón "Agregar +1" al contenedor del item
                itemCarrito.appendChild(botonAgregar);

                // Agregar el item al carrito en el contenedor
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

        // Guardar el carrito actualizado en localStorage
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
        actualizarCarrito();  // Actualizar el carrito con el nuevo producto
    }

    // Función para eliminar 1 unidad del producto del carrito
    function eliminarDelCarrito(index) {
        if (carrito[index].cantidad > 1) {
            // Si la cantidad es mayor que 1, disminuir la cantidad
            carrito[index].cantidad -= 1;
        } else {
            // Si la cantidad es 1, eliminar el producto completamente
            carrito.splice(index, 1);
        }
        actualizarCarrito();  // Actualizar el carrito después de la eliminación
    }

    // Asignar eventos a los botones de agregar al carrito
    const botonesAgregar = document.querySelectorAll('.agregar');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const nombreProducto = e.target.getAttribute('data-nombre');
            const precioProducto = parseFloat(e.target.getAttribute('data-precio'));
            const imagenProducto = e.target.getAttribute('data-imagen'); // Asegúrate de que el botón tenga un atributo data-imagen
            agregarAlCarrito(nombreProducto, precioProducto, imagenProducto);
        });
    });

    // Función para almacenar la información de pago en localStorage y redirigir a la página de factura
    const formularioPago = document.getElementById('formularioPago');
    formularioPago.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener los valores del formulario
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('Apellido').value;
        const dni = document.getElementById('dni').value;
        const telefono = document.getElementById('telefono').value;

        // Guardar los datos de pago en localStorage
        localStorage.setItem('nombre', nombre);
        localStorage.setItem('apellido', apellido);
        localStorage.setItem('dni', dni);
        localStorage.setItem('telefono', telefono);

        // Redirigir a la página de la factura
        window.location.href = '/factura.html'; // Redirige a la factura
    });

    // Inicializar el carrito con los datos guardados en localStorage
    actualizarCarrito();
});

function EvaluarAdmin() {
    window.location.href = "./html/loginAdmin.html";
}

function EvaluarUsuario() {
    window.location.href = "http://localhost:3000/tienda";
}