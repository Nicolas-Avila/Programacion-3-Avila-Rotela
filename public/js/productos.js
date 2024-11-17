document.addEventListener('DOMContentLoaded', () => {
    const nombreUsuario = "Juan Pérez";  // Cambiar con la lógica de obtención del nombre
    document.getElementById('nombreUsuarioSpan').textContent = nombreUsuario;

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
                        <p><strong>${producto.nombre}</strong></p>
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

                // Agregar el botón al contenedor del item
                itemCarrito.appendChild(botonEliminar);

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
    function agregarAlCarrito(nombre, precio) {
        // Buscar si el producto ya está en el carrito
        const productoExistente = carrito.find(producto => producto.nombre === nombre);

        if (productoExistente) {
            // Si ya existe, incrementar la cantidad
            productoExistente.cantidad += 1;
        } else {
            // Si no existe, agregarlo con cantidad 1
            carrito.push({ nombre, precio, cantidad: 1 });
        }

        actualizarCarrito();
    }

    // Función para eliminar 1 unidad del producto del carrito
    function eliminarDelCarrito(index) {
        if (carrito[index].cantidad > 1) {
            // Si la cantidad es mayor que 1, simplemente disminuirla
            carrito[index].cantidad -= 1;
        } else {
            // Si la cantidad es 1, eliminar el producto completamente
            carrito.splice(index, 1);
        }
        actualizarCarrito(); // Actualizar el carrito después de la eliminación
    }

    // Asignar eventos a los botones de agregar al carrito
    const botonesAgregar = document.querySelectorAll('.agregar');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const nombreProducto = e.target.getAttribute('data-nombre');
            const precioProducto = parseFloat(e.target.getAttribute('data-precio'));

            agregarAlCarrito(nombreProducto, precioProducto);
        });
    });

    const formularioPago = document.getElementById('formularioPago');
    formularioPago.addEventListener('submit', (e) => {
        e.preventDefault();
    
        // Obtener los valores del formulario
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('Apellido').value;
        const dni = document.getElementById('dni').value;
        const telefono = document.getElementById('telefono').value;
    
        // Guardar los datos en localStorage
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
