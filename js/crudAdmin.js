document.addEventListener("DOMContentLoaded", () => {
    const adminForm = document.getElementById("adminForm"); 
    const tableBody = document.getElementById("adminTable"); 

    /**
     * Carga y muestra la lista de administradores desde el servidor.
     * Se conecta al endpoint correspondiente para obtener los datos.
     */
    async function cargarAdmin() {
        try {
            const response = await fetch("http://localhost:3000/admin/");
            const admin = await response.json();
                        
            if (!Array.isArray(admin)) {
                throw new Error("La respuesta del servidor no es un array");
            }

            let adminHTML = "";
            admin.forEach((admin) => {
                adminHTML += `
                    <tr data-id="${admin.id}">
                        <td>${admin.id}</td>
                        <td>${admin.nombre}</td>
                        <td>${admin.password}</td>
                        <td>
                            <button class="btn btn-warning btn-modify adminModify"><i class="fas fa-edit"></i></button>
                            ${
                                admin.eliminado
                                    ? `<button class="btn btn-success btn-restore" data-id="${admin.id}"><i class="fas fa-undo-alt"></i></button>`
                                    : `<button class="btn btn-danger btn-delete" data-id="${admin.id}"><i class="fas fa-trash-alt"></i></button>`
                            }
                        </td>
                    </tr>
                `;
            });

            tableBody.innerHTML = "";
            tableBody.insertAdjacentHTML("beforeend", adminHTML);

        } catch (error) {
            console.error("Error al cargar administradores:", error);
        }
    }

    /**
     * Maneja el envío del formulario para crear un nuevo administrador.
     */
    adminForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nombreAdmin = document.getElementById("adminNombre").value;
        const passwordAdmin = document.getElementById("adminPassword").value;

        const newAdmin = { nombre: nombreAdmin, password: passwordAdmin };

        try {
            const response = await fetch("http://localhost:3000/admin/crear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAdmin),
            });

            if (!response.ok) {
                throw new Error("Error al crear el administrador");
            }

            console.log("Administrador creado:", await response.json());

            await cargarAdmin(); 
            adminForm.reset(); 

            const modalElement = document.getElementById("crearAdminModal");
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();

        } catch (error) {
            console.error("Error al crear administrador:", error);
        }
    });

    /**
     * Maneja la apertura del modal de edición con los datos del administrador seleccionado.
     */
    tableBody.addEventListener("click", async (event) => {
        if (event.target.closest(".btn-modify")) {
            const row = event.target.closest("tr");
            const adminId = row.getAttribute("data-id");
            const adminNombre = row.children[1].textContent;
            const adminPassword = row.children[2].textContent;

            console.log("Abriendo modal para editar administrador", adminId);

            document.getElementById("editAdminId").value = adminId;
            document.getElementById("editAdminNombre").value = adminNombre;
            document.getElementById("editAdminPassword").value = adminPassword;

            const editModal = new bootstrap.Modal(document.getElementById("editarAdminModal"));
            editModal.show();
        }
    });

    /**
     * Maneja el envío del formulario de edición de un administrador.
     */
    document.getElementById("editAdminForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const adminId = document.getElementById("editAdminId").value;
        const nombre = document.getElementById("editAdminNombre").value;
        const password = document.getElementById("editAdminPassword").value;

        try {
            const response = await fetch(`http://localhost:3000/admin/actualizar/${adminId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, password }),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar administrador");
            }

            await cargarAdmin();

            const editModalElement = document.getElementById("editarAdminModal");
            const modal = bootstrap.Modal.getInstance(editModalElement);
            modal.hide();

        } catch (error) {
            console.error("Error al actualizar administrador:", error);
        }
    });

    /**
     * Maneja la eliminación de un administrador seleccionado.
     */
    tableBody.addEventListener("click", async (event) => {
        if (event.target.closest(".btn-delete")) {
            const adminId = event.target.closest(".btn-delete").getAttribute("data-id");

            if (confirm("¿Estás seguro de que deseas eliminar este administrador?")) {
                try {
                    const response = await fetch(`http://localhost:3000/admin/eliminar/${adminId}`, {
                        method: "DELETE",
                    });

                    if (!response.ok) {
                        throw new Error("Error al eliminar administrador");
                    }

                    await cargarAdmin();

                } catch (error) {
                    console.error("Error al eliminar administrador:", error);
                }
            }
        }
    });

    /**
     * Maneja la descarga del archivo de ventas.
     */
    document.getElementById("descargarVentasBtn").addEventListener("click", () => {
        window.location.href = "http://localhost:3000/ventas/descargar";
    });

    cargarAdmin();
});
