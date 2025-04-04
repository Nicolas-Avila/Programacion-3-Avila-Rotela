// ===========================
// Función para evaluar el login del administrador
// ===========================

async function EvaluarAdmin(event) {
    event.preventDefault();
    console.log("La función EvaluarAdmin() se está ejecutando");

    // Obtener y limpiar los valores de los campos de entrada
    const nombreHtml = document.getElementById("nombreUsuario").value.trim();
    const passHtml = document.getElementById("passUsuario").value.trim();
    const mensajeHtml = document.getElementById("mensaje");

    // Validación de campos vacíos
    if (!nombreHtml || !passHtml) {
        mensajeHtml.style.display = "block";
        mensajeHtml.innerText = "Todos los campos son obligatorios.";
        return false;
    }

    // Crear un objeto con los datos del administrador
    const adminData = { nombre: nombreHtml, password: passHtml };

    try {
        // Realizar una solicitud POST al servidor para verificar las credenciales
        const response = await fetch("http://localhost:3000/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(adminData),
        });

        const result = await response.json();
        console.log("Respuesta del servidor:", result);

        if (result.success) {
            console.log("Autenticación exitosa, redirigiendo...");
            window.location.href = "../html/administrador.html";
        } else {
            mensajeHtml.style.display = "block";
            mensajeHtml.innerText = result.message || "Credenciales incorrectas.";
        }
    } catch (error) {
        console.error("Error en la autenticación:", error);
        mensajeHtml.style.display = "block";
        mensajeHtml.innerText = "Error en el servidor.";
    }

    return false;
}

// Asigna un evento al botón para llenar automáticamente los campos
document.getElementById("llenarDatos").addEventListener("click", () => {
    document.getElementById("nombreUsuario").value = "nicolas";
    document.getElementById("passUsuario").value = "123456";
});
