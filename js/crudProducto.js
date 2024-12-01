document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("productForm");
    const tableBody = document.querySelector("table tbody");

    // Función para cargar productos desde el servidor
    async function cargarProductos() {
        try {
            const response = await fetch("http://localhost:3000/productos/todosIncluidos");
            const productos = await response.json();
            let productosHTML = "";

            // Construcción de las filas de la tabla con los productos
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
                                : `<button class="btn btn-danger btn-delete" data-id="${producto.id}"><i class="fas fa-trash-alt"></i></button>`
                            }
                        </td>
                    </tr>
                `;
            });

            // Limpia y actualiza la tabla con los productos
            tableBody.innerHTML = "";
            tableBody.insertAdjacentHTML("beforeend", productosHTML);

            // Asignación de eventos a los botones de eliminar/restaurar
            document.querySelectorAll(".btn-delete").forEach((button) => {
                button.addEventListener("click", async (event) => {
                    const productId = event.currentTarget.getAttribute("data-id");
                    await eliminarProducto(productId);
                });
            });

            document.querySelectorAll(".btn-restore").forEach((button) => {
                button.addEventListener("click", async (event) => {
                    const productId = event.currentTarget.getAttribute("data-id");
                    await restaurarProducto(productId);
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

    // Función para restaurar un producto
    async function restaurarProducto(id) {
        try {
            const response = await fetch(`http://localhost:3000/productos/restaurar/${id}`, {
                method: "PUT",
            });
            const result = await response.json();

            await cargarProductos();
        } catch (error) {
            console.error("Error al restaurar producto:", error);
        }
    }

    // Función para eliminar (dar de baja) un producto
    async function eliminarProducto(id) {
        try {
            const response = await fetch(`http://localhost:3000/productos/quitar/${id}`, {
                method: "DELETE",
            });
            const result = await response.json();

            await cargarProductos();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    }

    // Función para cargar los datos de un producto en el formulario de edición
    async function cargarProductoParaEditar(id) {
        try {
            // Cargar todos los productos desde el backend
            const response = await fetch("http://localhost:3000/productos/todosIncluidos");
            const productos = await response.json();
    
            // Buscar el producto por ID
            const producto = productos.find(p => p.id == id);
            if (!producto) {
                console.error("Producto no encontrado");
                return;
            }
    
            // Llena los campos del formulario de edición con los datos del producto
            document.getElementById("editProductId").value = producto.id;
            document.getElementById("editNombreProducto").value = producto.nombreProducto;
            document.getElementById("editDescripcionProducto").value = producto.descripcionProducto;
            document.getElementById("editPrecioProducto").value = producto.precioProducto;
            document.getElementById("editTipo").value = producto.tipo;           
            // Mostrar el modal de edición
            const modalElement = document.getElementById("editarModal");
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        } catch (error) {
            console.error("Error al cargar producto para editar:", error);
        }
    }
    

    productForm.addEventListener("submit", async (event) => {
        event.preventDefault();
    
        // Crea un objeto FormData para manejar la subida de archivos
        const formData = new FormData();
    
        // Agrega los valores del formulario a FormData
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
            // Envía los datos a través de fetch usando FormData
            const response = await fetch("http://localhost:3000/productos/crear", {
                method: "POST",
                body: formData,
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al crear producto: ${errorText}`);
            }
    
            const result = await response.json();
            console.log("Producto creado:", result);
    
            await cargarProductos();
    
            productForm.reset();
    
            // Cerrar el modal de creación
            const modalElement = document.getElementById("crearModal");
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
        } catch (error) {
            console.error("Error al crear producto:", error);
        }
    });
    
    

    document.getElementById("editProductForm").addEventListener("submit", async (event) => {
        event.preventDefault();
    
        // Obtener los valores del formulario de edición
        const id = document.getElementById("editProductId").value;
        const nombreProducto = document.getElementById("editNombreProducto").value;
        const descripcionProducto = document.getElementById("editDescripcionProducto").value;
        const precioProducto = parseFloat(document.getElementById("editPrecioProducto").value);
        const tipo = document.getElementById("editTipo").value;
    
        // Crear un FormData para incluir la imagen y otros datos
        const formData = new FormData();
        formData.append("nombreProducto", nombreProducto);
        formData.append("descripcionProducto", descripcionProducto);
        formData.append("precioProducto", precioProducto);
        formData.append("tipo", tipo);  
        try {
            const response = await fetch(`http://localhost:3000/productos/actualizar/${id}`, {
                method: "PUT",
                body: formData,
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al actualizar el producto: ${errorText}`);
            }
    
            const result = await response.json();
    
            // Cerrar el modal de edición
            const modalElement = document.getElementById("editarModal");
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
    
            await cargarProductos();
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    });
    

    

    // Cargar los productos al iniciar la página
    cargarProductos();
});
