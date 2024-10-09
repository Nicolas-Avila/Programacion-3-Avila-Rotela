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
                    mostrarCarrito();
                });
            });
        });

    //Muestrar los productos del carrito y agregar botón para abrir el modal
    function mostrarCarrito() {
        const carritoDiv = document.getElementById("carrito");
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
});
