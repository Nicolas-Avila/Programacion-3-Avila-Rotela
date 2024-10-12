document.addEventListener("DOMContentLoaded", function () {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productosCarritoDiv = document.getElementById("productos-carrito");
    let total = 0;
    carrito.forEach(item => {
        total += parseInt(item.precio)
        productosCarritoDiv.insertAdjacentHTML('beforeend', `
            <div class="producto">
                <span>${item.nombre}: $${item.precio}</span>
            </div>            
        `);
    });
    productosCarritoDiv.insertAdjacentHTML('beforeend', `
        <span>Total: $${total}</span>
        `);

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
