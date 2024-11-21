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
    


    cargarAdmin();
});