document.addEventListener("DOMContentLoaded", function() {
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
                            <a href="#" class="btn btn-primary">Agregar producto</a>
                        </div>
                    </div>`;
            });
            document.getElementById("contenedor-productos").innerHTML = productosHTML;
        })
});
