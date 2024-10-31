class Producto {
    nombreProducto = "";
    descripcionProducto = "";
    imgSrc = "";
    precioProducto = 0;

    constructor({ nombreProducto, descripcionProducto, imgSrc, precioProducto }) {
        this.nombreProducto = nombreProducto;
        this.descripcionProducto = descripcionProducto;
        this.imgSrc = imgSrc;
        this.precioProducto = precioProducto;
    }
    toJson() {
        return JSON.stringify(this);
    }
}
module.exports = Producto;