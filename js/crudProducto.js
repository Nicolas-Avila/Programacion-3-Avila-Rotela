document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("productForm");
    const tableBody = document.querySelector("table tbody");

    // Función para cargar productos
    async function cargarProductos() {
        try {
            const response = await fetch("http://localhost:3000/productos/todosIncluidos");
            const productos = await response.json();
            let productosHTML = "";

            productos.forEach((producto) => {
                productosHTML += `
                    <tr data-id="${producto.id}">
                        <td>${producto.id}</td>
                        <td><img src="${producto.imgSrc}" alt="${producto.nombreProducto}" style="width: 50px; height: auto;"></td>
                        <td>${producto.nombreProducto}</td>
                        <td>${producto.descripcionProducto}</td>
                        <td>${producto.precioProducto}</td>
                        <td>${producto.eliminado ? "No está en venta" : "En venta"}</td>
                        <td>
                            <button class="btn btn-warning btn-modify"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-danger btn-delete" data-id="${producto.id}"><i class="fas fa-trash-alt"></i></button>
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

            document.querySelectorAll(".btn-modify").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const productId = event.currentTarget.closest('tr').dataset.id;
                    cargarProductoParaEditar(productId);
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

            await cargarProductos();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    }

    // Función para cargar los datos de un producto en el modal de edición
    async function cargarProductoParaEditar(id) {
        try {
            const response = await fetch("http://localhost:3000/productos/todosIncluidos");
            const productos = await response.json();

            const producto = productos.find(p => p.id == id);
            if (!producto) {
                console.error("Producto no encontrado");
                return;
            }

            document.getElementById("editProductId").value = producto.id;
            document.getElementById("editNombreProducto").value = producto.nombreProducto;
            document.getElementById("editDescripcionProducto").value = producto.descripcionProducto;
            document.getElementById("editImgSrc").value = producto.imgSrc;
            document.getElementById("editPrecioProducto").value = producto.precioProducto;

            const modalElement = document.getElementById("editarModal");
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        } catch (error) {
            console.error("Error al cargar producto para editar:", error);
        }
    }

    // Crear producto
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

            await cargarProductos();

            productForm.reset();

            const modalElement = document.getElementById("crearModal");
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
        } catch (error) {
            console.error("Error al crear producto:", error);
        }
    });

    // Función para actualizar el producto
    document.getElementById("editProductForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const id = document.getElementById("editProductId").value;
        const nombreProducto = document.getElementById("editNombreProducto").value;
        const descripcionProducto = document.getElementById("editDescripcionProducto").value;
        const imgSrc = document.getElementById("editImgSrc").value;
        const precioProducto = parseFloat(document.getElementById("editPrecioProducto").value);

        const updatedProduct = {
            nombreProducto,
            descripcionProducto,
            imgSrc,
            precioProducto,
            eliminado: false,
        };

        try {
            const response = await fetch(`http://localhost:3000/productos/actualizar/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedProduct),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al actualizar el producto: ${errorText}`);
            }

            const result = await response.json();
            console.log("Producto actualizado:", result);

            const modalElement = document.getElementById("editarModal");
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();

            await cargarProductos();
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    });

    cargarProductos();
});
