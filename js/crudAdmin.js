document.addEventListener("DOMContentLoaded", () => {
    const adminForm = document.getElementById("adminForm");
    const tableBody = document.getElementById("adminTable");
    // Función para cargar productos

    async function cargarAdmin() {
        try {
            const response = await fetch("http://localhost:3000/admin/");
            const admin = await response.json();
            let adminHTML = "";

            admin.forEach((admin) => {
                adminHTML += `
                <tr data-id="${admin.id}">
                    <td>${admin.id}</td>
                    <td>${admin.nombre}</td>
                    <td>${admin.password}</td>
                    <td>
                        <button class="btn btn-warning btn-modify"><i class="fas fa-edit"></i></button>
                        ${admin.eliminado
                        ? `<button class="btn btn-success btn-restore" data-id="${admin.id}"><i class="fas fa-undo-alt"></i></button>`
                        : `<button class="btn btn-danger btn-delete" data-id="${admin.id}"><i class="fas fa-trash-alt"></i></button>`
                    }
                    </td>
                </tr>
            `;
            });

            tableBody.innerHTML = "";
            tableBody.insertAdjacentHTML("beforeend", adminHTML);

        }
        catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }

    //crear admin
    adminForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const nombreAdmin = document.getElementById("adminNombre").value;
        const passwordAdmin = document.getElementById("adminPassword").value;

        // Cambiar las propiedades del objeto a "nombre" y "password"
        const newAdmin = {
            nombre: nombreAdmin,
            password: passwordAdmin
        };

        try {
            const response = await fetch("http://localhost:3000/admin/crear", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newAdmin),
            });

            if (!response.ok) {
                throw new Error("Error al crear el administrador");
            }

            const result = await response.json();
            console.log("Administrador creado:", result);

            // Recargar la lista de administradores
            await cargarAdmin();

            adminForm.reset();

            const modalElement = document.getElementById("crearAdminModal");
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
        } catch (error) {
            console.error("Error al crear administrador:", error);
        }
    });


    // Captura el clic en el botón de editar
    tableBody.addEventListener("click", async (event) => {
        if (event.target.closest(".btn-modify")) {
            const row = event.target.closest("tr");
            const adminId = row.getAttribute("data-id");
            const adminNombre = row.children[1].textContent;
            const adminPassword = row.children[2].textContent;

            // Rellenar el modal de edición con los datos actuales
            document.getElementById("editAdminId").value = adminId;
            document.getElementById("editAdminNombre").value = adminNombre;
            document.getElementById("editAdminPassword").value = adminPassword;

            // Mostrar el modal de edición
            const editModal = new bootstrap.Modal(document.getElementById("editarAdminModal"));
            editModal.show();
        }
    });

    // Actualizar administrador
    document.getElementById("editAdminForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const adminId = document.getElementById("editAdminId").value;
        const nombre = document.getElementById("editAdminNombre").value;
        const password = document.getElementById("editAdminPassword").value;

        try {
            const response = await fetch(`http://localhost:3000/admin/actualizar/${adminId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, password })
            });

            if (!response.ok) {
                throw new Error("Error al actualizar administrador");
            }

            // Recargar la lista de administradores
            await cargarAdmin();

            // Cerrar el modal
            const editModalElement = document.getElementById("editarAdminModal");
            const modal = bootstrap.Modal.getInstance(editModalElement);
            modal.hide();

        } catch (error) {
            console.error("Error al actualizar administrador:", error);
        }
    });

    // Captura el clic en el botón de eliminar
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

                    // Recargar la lista de administradores
                    await cargarAdmin();

                } catch (error) {
                    console.error("Error al eliminar administrador:", error);
                }
            }
        }
    });



    cargarAdmin();
});