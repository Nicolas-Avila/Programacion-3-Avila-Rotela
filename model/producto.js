class Producto {
    constructor({ nombreProducto, descripcionProducto, imgSrc, precioProducto, tipo }) {
        this.nombreProducto = nombreProducto; 
        this.descripcionProducto = descripcionProducto;
        this.imgSrc = imgSrc ; 
        this.precioProducto = precioProducto ; 
        this.tipo = tipo ; 
    }

    // Método para convertir la instancia a un JSON serializable
    toJson() {
        return JSON.stringify({
            nombreProducto: this.nombreProducto,
            descripcionProducto: this.descripcionProducto,
            imgSrc: this.imgSrc,
            precioProducto: this.precioProducto,
            tipo: this.tipo,
        });
    }
}

module.exports = Producto;
