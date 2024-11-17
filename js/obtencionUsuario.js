const botonIngresar = document.getElementById("ingresar");

if (botonIngresar) {
    botonIngresar.addEventListener("click", function() {
        const nombreUsuario = document.getElementById("nombreUsuario").value;
        if (nombreUsuario) {
            localStorage.setItem("nombreUsuario", nombreUsuario);
        } else {
            localStorage.setItem("nombreUsuario", "Invitado");
        }
    });
}


document.addEventListener("DOMContentLoaded", function() {
    const nombreUsuarioSpan = document.getElementById("nombreUsuarioSpan");
    
    if (nombreUsuarioSpan) {
        const nombreUsuario = localStorage.getItem("nombreUsuario");
        
        nombreUsuarioSpan.textContent = nombreUsuario ? nombreUsuario : "Invitado";
    }
});
function EvaluarAdmin() {
    window.location.href = "./html/loginAdmin.html";
}

function EvaluarUsuario() {
    window.location.href = "http://localhost:3000/tienda";
}


