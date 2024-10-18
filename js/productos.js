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

    function mostrarCarrito() {
        const carritoDiv = document.getElementById("carrito");
        carritoDiv.innerHTML = '';
        carrito.forEach((item, index) => {            
            carritoDiv.insertAdjacentHTML('beforeend', `
                    <div class="d-flex align-items-center mb-2">
                        <img src="${item.imgSrc}" alt="${item.nombre}" style="width: 80px; height: auto;" class="me-2">
                        <span>${item.nombre}: $${item.precio}</span>
                        <button class="ms-auto btn btn-link p-0" id="basura-${index}" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">  
                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                            </svg>
                        </button>
                    </div>
                `);
            document.getElementById(`basura-${index}`).addEventListener('click', function (event) {
                carrito.splice(index, 1);
                localStorage.setItem("carrito", JSON.stringify(carrito));
                mostrarCarrito();
            })

        });

        //Botón para abrir el modal
        carritoDiv.insertAdjacentHTML('beforeend', `
                <div class="mt-3">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#compraModal">Finalizar compra</button>
                </div>
            `);

    }





    function datosUsuario() {
        console.log("FAISFAS")
        document.getElementById('formularioPago').addEventListener('submit', function (event) {
            event.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('Apellido').value;
            const dni = document.getElementById('dni').value;
            const telefono = document.getElementById('telefono').value;
            const numeroTarjeta = document.getElementById('numero-tarjeta').value;
            const fechaCaducidad = document.getElementById('fecha-caducidad').value;
            const codigoSeguridad = document.getElementById('codigo-seguridad').value;

            localStorage.setItem('nombre', nombre);
            localStorage.setItem('apellido', apellido);
            localStorage.setItem('dni', dni);
            localStorage.setItem('telefono', telefono);
            localStorage.setItem('numeroTarjeta', numeroTarjeta);
            localStorage.setItem('fechaCaducidad', fechaCaducidad);
            localStorage.setItem('codigoSeguridad', codigoSeguridad);

            window.location.href = "factura.html";
        });
    }
    datosUsuario();


});
