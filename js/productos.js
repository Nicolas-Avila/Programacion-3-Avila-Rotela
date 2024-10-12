document.addEventListener("DOMContentLoaded", function () {
    const carrito = [];
    fetch('../json/productos.json')
        .then(response => response.json())
        .then(data => {
            let productosHTML = '';
            data.productos.forEach(producto => {
                productosHTML += `
                    <div class="card col-md-4 col-sm-6 col-lg-3 m-4 ave">
                        <div style="position: relative;">
                            <img src="${producto.imgSrc}" class="card-img-top" alt="${producto.nombreProducto}">
                            <div class="precio"> $${producto.precioProducto} </div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombreProducto}</h5>
                            <p class="card-text">${producto.descripcionProducto}</p>
                            <a href="#" class="btn btn-primary" data-nombre="${producto.nombreProducto}" data-precio="${producto.precioProducto}" data-img="${producto.imgSrc}">Agregar producto</a>
                        </div>
                    </div>`;
            });
            document.getElementById("contenedor-productos").insertAdjacentHTML('beforeend', productosHTML);

            document.querySelectorAll('.btn-primary').forEach(boton => {
                boton.addEventListener('click', function (event) {
                    event.preventDefault();
                    const nombre = this.getAttribute('data-nombre');
                    const precio = this.getAttribute('data-precio');
                    const imgSrc = this.getAttribute('data-img');

                    carrito.push({ nombre, precio, imgSrc });
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    mostrarCarrito();
                });
            });
        });

    //Muestrar los productos del carrito y agregar botón para abrir el modal
    function mostrarCarrito() {
        const carritoDiv = document.getElementById("carrito");
        carritoDiv.innerHTML = '';
        carrito.forEach(item => {
            carritoDiv.insertAdjacentHTML('beforeend', `
                <div class="d-flex align-items-center mb-2">
                    <img src="${item.imgSrc}" alt="${item.nombre}" style="width: 80px; height: auto;" class="me-2">
                    <span>${item.nombre}: $${item.precio}</span>
                </div>`);
        });

        carritoDiv.insertAdjacentHTML('beforeend', `
            <div class="mt-3">
                <!-- Botón para abrir el modal -->
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#compraModal">Finalizar compra</button>
            </div>`);
    }

    function datosUsuario() {
        console.log("FAISFAS")
        document.getElementById('formularioPago').addEventListener('submit', function (event) {
            event.preventDefault(); // Evita que el formulario se envíe

            // Captura los valores del formulario
            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('Apellido').value;
            const dni = document.getElementById('dni').value;
            const telefono = document.getElementById('telefono').value;
            const numeroTarjeta = document.getElementById('numero-tarjeta').value;
            const fechaCaducidad = document.getElementById('fecha-caducidad').value;
            const codigoSeguridad = document.getElementById('codigo-seguridad').value;

            // Almacena los valores en localStorage
            localStorage.setItem('nombre', nombre);
            localStorage.setItem('apellido', apellido);
            localStorage.setItem('dni', dni);
            localStorage.setItem('telefono', telefono);
            localStorage.setItem('numeroTarjeta', numeroTarjeta);
            localStorage.setItem('fechaCaducidad', fechaCaducidad);
            localStorage.setItem('codigoSeguridad', codigoSeguridad);

            // Redirige a la página de factura o haz lo que necesites
            window.location.href = "factura.html";
        });
    }
    datosUsuario();


});
