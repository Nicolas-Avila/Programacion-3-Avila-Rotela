function EvaluarUsuario()
{
    const nombreDelUsuario = document.getElementById("nombreUsuario");
    const divDePassword = document.getElementById("divDePass");
    const passUsuario = document.getElementById("passwordUsuario");
    const mensaje = document.getElementById("passError");

    if(nombreDelUsuario.value === "Admin")
    {
        divDePassword.style.display = "block";
        if(passUsuario.value == "")
        {
            mensaje.style.display = "none";

        }
        else
        {
            if(passUsuario.value === "Alfa")
            {
                // hacer lo que le corresponde al admin
                console.log("entró el admin");
                mensaje.style.display = "block";
                mensaje.value = "Bienvenido..";
            }
            else
            {
                // mostrar error
                console.log("no puso la pass correcta");
                mensaje.style.display = "block";
                mensaje.value = "No es la password correcta";
            }
        }
    }
    else
    {
        window.location.href = "./html/principal.html";
    }
}