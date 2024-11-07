document.addEventListener("DOMContentLoaded", () => {
    // Capturar el botón y formulario
   
    const productForm = document.getElementById("productForm");

    // Enviar los datos del formulario al servidor cuando se envíe
    productForm.addEventListener("submit", async (event) => {
        event.preventDefault(); 

        // Obtener los valores del formulario
        const nombreProducto = document.getElementById("nombreProducto").value;
        const descripcionProducto = document.getElementById("descripcionProducto").value;
        const imgSrc = document.getElementById("imgSrc").value;
        const precioProducto = parseFloat(document.getElementById("precioProducto").value);

        // Crear el objeto del nuevo producto
        const newProduct = {
            nombreProducto,
            descripcionProducto,
            imgSrc,
            precioProducto,
            eliminado: false
        };

        try {
            const response = await fetch("http://localhost:3000/productos/crear", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProduct),
            });
            const result = await response.json();
            console.log("Producto creado:", result);

            
            productForm.reset();
            
        } catch (error) {
            console.error("Error al crear producto:", error);
        }
    });
});