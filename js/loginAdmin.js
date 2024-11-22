// Función para evaluar el login
async function EvaluarAdmin(event) {
    event.preventDefault();  // Evita que la página se recargue al enviar el formulario
    console.log("La función EvaluarAdmin() se está ejecutando");

    const nombreHtml = document.getElementById("nombreUsuario").value.trim();
    const passHtml = document.getElementById("passUsuario").value.trim();
    const mensajeHtml = document.getElementById("mensaje");

    // Validación de campos vacíos
    if (!nombreHtml || !passHtml) {
        mensajeHtml.style.display = "block";
        mensajeHtml.innerText = "Todos los campos son obligatorios.";
        return false;  // Detiene el proceso si faltan datos
    }

    const adminData = { nombre: nombreHtml, password: passHtml };

    try {
        const response = await fetch("http://localhost:3000/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(adminData),
        });

        const result = await response.json();
        console.log("Respuesta del servidor:", result);  // Depuración

        if (result.success) {
            console.log("Autenticación exitosa, redirigiendo...");
            window.location.href = "../html/administrador.html";  // Redirección a la página de administración
        } else {
            mensajeHtml.style.display = "block";
            mensajeHtml.innerText = result.message || "Credenciales incorrectas.";
        }
    } catch (error) {
        console.error("Error en la autenticación:", error);
        mensajeHtml.style.display = "block";
        mensajeHtml.innerText = "Error en el servidor.";
    }

    return false;  // Evita el envío del formulario tradicional
}

// Función para autocompletar los campos de usuario y contraseña
document.getElementById("llenarDatos").addEventListener("click", () => {
    document.getElementById("nombreUsuario").value = "nicolas";  // Usuario de prueba
    document.getElementById("passUsuario").value = "1234";   // Contraseña de prueba
});
