class Admin {
    nombre = "";
    password = "";


    constructor({ nombre, password}) {
        this.nombre = nombre;
        this.password = password;
    }
    toJson() {
        return JSON.stringify(this);
    }
}
module.exports = Admin;