document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("productForm");
    const tableBody = document.querySelector("table tbody");

    /**
     * Función para cargar productos desde el servidor
     * Solicita al servidor la lista completa de productos y los muestra en la tabla.
     */
    async function cargarProductos() {
        try {
            const response = await fetch("http://localhost:3000/productos/todosIncluidos");
            const productos = await response.json();
            let productosHTML = "";

            productos.forEach((producto) => {
                productosHTML += `
                    <tr data-id="${producto.id}">
                        <td>${producto.id}</td>
                        <td><img src="../public${producto.imgSrc}" alt="${producto.nombreProducto}" style="width: 50px; height: auto;"></td>
                        <td>${producto.nombreProducto}</td>
                        <td>${producto.descripcionProducto}</td>
                        <td>${producto.precioProducto}</td>
                        <td>${producto.tipo}</td>
                        <td>${producto.eliminado ? "No está en venta" : "En venta"}</td>
                        <td>
                            <button class="btn btn-warning btn-modify"><i class="fas fa-edit"></i></button>
                            ${producto.eliminado
                                ? `<button class="btn btn-success btn-restore" data-id="${producto.id}"><i class="fas fa-undo-alt"></i></button>`
                                : `<button class="btn btn-danger btn-delete" data-id="${producto.id}"><i class="fas fa-trash-alt"></i></button>`}
                        </td>
                    </tr>
                `;
            });

            tableBody.innerHTML = "";
            tableBody.insertAdjacentHTML("beforeend", productosHTML);

            // Agrega eventos a los botones de eliminar, restaurar y editar
            document.querySelectorAll(".btn-delete").forEach((button) =>
                button.addEventListener("click", async (event) => {
                    const productId = event.currentTarget.getAttribute("data-id");
                    await eliminarProducto(productId);
                })
            );

            document.querySelectorAll(".btn-restore").forEach((button) =>
                button.addEventListener("click", async (event) => {
                    const productId = event.currentTarget.getAttribute("data-id");
                    await restaurarProducto(productId);
                })
            );

            document.querySelectorAll(".btn-modify").forEach((button) =>
                button.addEventListener("click", (event) => {
                    const productId = event.currentTarget.closest("tr").dataset.id;
                    cargarProductoParaEditar(productId);
                })
            );
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }

    /**
     * Función para restaurar un producto.
     * Envía una solicitud al servidor para restaurar un producto eliminado.
     */
    async function restaurarProducto(id) {
        try {
            const response = await fetch(`http://localhost:3000/productos/restaurar/${id}`, {
                method: "PUT",
            });
            await cargarProductos();
        } catch (error) {
            console.error("Error al restaurar producto:", error);
        }
    }

    /**
     * Función para eliminar un producto.
     * Envía una solicitud al servidor para dar de baja un producto.
     */
    async function eliminarProducto(id) {
        try {
            const response = await fetch(`http://localhost:3000/productos/quitar/${id}`, {
                method: "DELETE",
            });
            await cargarProductos();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    }

    /**
     * Función para cargar un producto en el formulario de edición.
     * Carga los datos de un producto específico en el modal de edición.
     */
    async function cargarProductoParaEditar(id) {
        try {
            const response = await fetch("http://localhost:3000/productos/todosIncluidos");
            const productos = await response.json();

            const producto = productos.find((p) => p.id == id);
            if (!producto) {
                console.error("Producto no encontrado");
                return;
            }

            document.getElementById("editProductId").value = producto.id;
            document.getElementById("editNombreProducto").value = producto.nombreProducto;
            document.getElementById("editDescripcionProducto").value = producto.descripcionProducto;
            document.getElementById("editPrecioProducto").value = producto.precioProducto;
            document.getElementById("editTipo").value = producto.tipo;

            const modalElement = document.getElementById("editarModal");
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        } catch (error) {
            console.error("Error al cargar producto para editar:", error);
        }
    }

    /**
     * Maneja la creación de un nuevo producto.
     * Envía los datos del formulario al servidor utilizando `FormData` para incluir archivos.
     */
    productForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(); 
        formData.append("nombreProducto", document.getElementById("nombreProducto").value);
        formData.append("descripcionProducto", document.getElementById("descripcionProducto").value);

        const imgInput = document.getElementById("imgSrc");
        if (imgInput && imgInput.files.length > 0) {
            formData.append("imgSrc", imgInput.files[0]);
        } else {
            console.error("No se ha seleccionado ningún archivo de imagen");
            return;
        }

        formData.append("precioProducto", parseFloat(document.getElementById("precioProducto").value));
        formData.append("tipo", document.getElementById("tipo").value);

        try {
            const response = await fetch("http://localhost:3000/productos/crear", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error al crear producto: ${await response.text()}`);
            }

            await cargarProductos(); 
            productForm.reset(); 

            const modalElement = document.getElementById("crearModal");
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
        } catch (error) {
            console.error("Error al crear producto:", error);
        }
    });

    /**
     * Maneja la edición de un producto.
     * Envía los datos actualizados del formulario al servidor.
     */
    document.getElementById("editProductForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const id = document.getElementById("editProductId").value;
        const formData = new FormData();

        formData.append("nombreProducto", document.getElementById("editNombreProducto").value);
        formData.append("descripcionProducto", document.getElementById("editDescripcionProducto").value);
        formData.append("precioProducto", parseFloat(document.getElementById("editPrecioProducto").value));
        formData.append("tipo", document.getElementById("editTipo").value);

        try {
            const response = await fetch(`http://localhost:3000/productos/actualizar/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error al actualizar el producto: ${await response.text()}`);
            }

            await cargarProductos(); 

            const modalElement = document.getElementById("editarModal");
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    });

    cargarProductos();
});
