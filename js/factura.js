document.addEventListener("DOMContentLoaded", function () {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productosCarritoDiv = document.getElementById("productos-carrito");
    let total = 0;

    // Mostrar los productos del carrito con su cantidad y calcular el total
    carrito.forEach(item => {
        const subtotal = parseInt(item.precio) * item.cantidad;
        total += subtotal;
        productosCarritoDiv.insertAdjacentHTML('beforeend', `
            <div class="producto">
                <span>${item.nombre} (x${item.cantidad}): $${subtotal}</span>
            </div>            
        `);
    });

    // Mostrar el total
    productosCarritoDiv.insertAdjacentHTML('beforeend', `
        <div class="total">
            <strong>Total: $${total}</strong>
        </div>
    `);

    // Mostrar los datos del usuario en la factura
    function datosUsuario() {
        const nombre = localStorage.getItem('nombre');
        const apellido = localStorage.getItem('apellido');
        const dni = localStorage.getItem('dni');
        const telefono = localStorage.getItem('telefono');

        document.getElementById('nombre').textContent = nombre;
        document.getElementById('apellido').textContent = apellido;
        document.getElementById('dni').textContent = dni;
        document.getElementById('telefono').textContent = telefono;
    }

    datosUsuario();
});
