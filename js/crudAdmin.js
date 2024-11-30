// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", () => {
    const adminForm = document.getElementById("adminForm");  // Formulario para crear administradores
    const tableBody = document.getElementById("adminTable"); // Cuerpo de la tabla que muestra los administradores

    // Función para cargar la lista de administradores desde el servidor
    async function cargarAdmin() {
        try {
            const response = await fetch("http://localhost:3000/admin/");
            const admin = await response.json();  // Obtener los datos en formato JSON
            
            console.log(admin);  // Verificar la respuesta
    
            // Verificar que `admin` sea un array antes de intentar usar forEach
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
    
        } catch (error) {
            console.error("Error al cargar administradores:", error);
        }
    }
    

    // Evento para crear un nuevo administrador
    adminForm.addEventListener("submit", async (event) => {
        event.preventDefault();  

        // Obtener los valores del formulario
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

            // Cerrar el modal de creación
            const modalElement = document.getElementById("crearAdminModal");
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();

        } catch (error) {
            console.error("Error al crear administrador:", error);
        }
    });

    // Evento para abrir el modal de edición con los datos actuales del administrador
    tableBody.addEventListener("click", async (event) => {
        if (event.target.closest(".btn-modify")) {
            const row = event.target.closest("tr");
            const adminId = row.getAttribute("data-id");
            const adminNombre = row.children[1].textContent;
            const adminPassword = row.children[2].textContent;
    
            // Verificar que el evento sea el correcto
            console.log("Abriendo modal para editar administrador", adminId);
    
            // Rellenar el formulario del modal de edición
            document.getElementById("editAdminId").value = adminId;
            document.getElementById("editAdminNombre").value = adminNombre;
            document.getElementById("editAdminPassword").value = adminPassword;
    
            // Mostrar el modal de edición de administrador
            const editModal = new bootstrap.Modal(document.getElementById("editarAdminModal"));
            editModal.show();
        }
    });

    // Evento para actualizar un administrador
    document.getElementById("editAdminForm").addEventListener("submit", async (event) => {
        event.preventDefault(); 

        // Obtener los valores actualizados del formulario
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

            // Cerrar el modal de edición
            const editModalElement = document.getElementById("editarAdminModal");
            const modal = bootstrap.Modal.getInstance(editModalElement);
            modal.hide();

        } catch (error) {
            console.error("Error al actualizar administrador:", error);
        }
    });

    // Evento para eliminar un administrador
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

    // Cargar la lista de administradores al cargar la página
    cargarAdmin();
});
