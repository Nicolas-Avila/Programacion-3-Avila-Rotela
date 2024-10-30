function EvaluarAdmin()
{
    // sería buena idea crear una página de gestión de usuarios y pass para cuando se olvide
    const usuario = "admin";
    const password = "123";

    const nombreHtml = document.getElementById("nombreUsuario");
    const passHtml = document.getElementById("passUsuario");
    const mensajeHtml = document.getElementById("mensaje");


    if(nombreHtml.value === usuario && passHtml.value === password)
    {
        window.location.href = "../html/administrador.html";
        return false;
    }
    else
    {
        mensajeHtml.style.display = "block";
        return false; // Evita que el formulario se envíe
    }
}
