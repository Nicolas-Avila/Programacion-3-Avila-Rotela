document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("productForm");
    const tableBody = document.querySelector("table tbody");

    // Función para cargar productos
    async function cargarProductos() {
        try {
            const response = await fetch("http://localhost:3000/productos/mostrar");
            const productos = await response.json();
            let productosHTML = "";

            productos.forEach((producto) => {
                productosHTML += `
                    <tr>
                        <td>${producto.id}</td>
                        <td><img src="${producto.imgSrc}" alt="${producto.nombreProducto}" style="width: 50px; height: auto;"></td>
                        <td>${producto.nombreProducto}</td>
                        <td>${producto.descripcionProducto}</td>
                        <td>${producto.precioProducto}</td>
                        <td>
                            <button class="btn btn-modify"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-delete" data-id="${producto.id}"><i class="fas fa-trash-alt"></i></button>
                        </td>
                    </tr>
                `;
            });

            tableBody.innerHTML = "";
            tableBody.insertAdjacentHTML("beforeend", productosHTML);

            document.querySelectorAll(".btn-delete").forEach((button) => {
                button.addEventListener("click", async (event) => {
                    const productId = event.currentTarget.getAttribute("data-id");
                    await eliminarProducto(productId);
                });
            });
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }

    // Función para eliminar un producto
    async function eliminarProducto(id) {
        try {
            const response = await fetch(`http://localhost:3000/productos/quitar/${id}`, {
                method: "DELETE",
            });
            const result = await response.json();
            console.log("Producto eliminado:", result);

            location.reload()
            cargarProductos();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    }

    //crear producto
    productForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const nombreProducto = document.getElementById("nombreProducto").value;
        const descripcionProducto = document.getElementById("descripcionProducto").value;
        const imgSrc = document.getElementById("imgSrc").value;
        const precioProducto = parseFloat(document.getElementById("precioProducto").value);

        const newProduct = {
            nombreProducto,
            descripcionProducto,
            imgSrc,
            precioProducto,
            eliminado: false
        };
        try {
            const response = await fetch("http://localhost:3000/productos/crear", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProduct),
            });
            const result = await response.json();
            console.log("Producto creado:", result);
            cargarProductos();
            productForm.reset();
        } catch (error) {
            console.error("Error al crear producto:", error);
        }
    });
    cargarProductos();
});
