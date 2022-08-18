
const IVA = 0.21;
const telefono = "5491133031334";
let adminSortAsc = false;
let adminSortCol;
const adminPageSize = 3;
let curAdminPage = 1;
const prodPageSize = 4;
let curProdPage = 1;
let prodFiltrados = [];
let prodId = 0;

// funcion que encontre para que el redondeo sea mas exacto, que el Math.round() a secas
const decimalesPrecisos = (function() {
    if (Number.EPSILON === undefined) {
        Number.EPSILON = Math.pow(2, -52);
    }
    if (Math.trunc === undefined) {
        Math.trunc = function(v) {
            return v < 0 ? Math.ceil(v) : Math.floor(v);
        };
    }
    var powers = [
        1e0,  1e1,  1e2,  1e3,  1e4,  1e5,  1e6,  1e7,
        1e8,  1e9,  1e10, 1e11, 1e12, 1e13, 1e14, 1e15,
        1e16, 1e17, 1e18, 1e19, 1e20, 1e21, 1e22
    ];
    var intpow10 = function(power) {
        if (power < 0 || power > 22) {
            return Math.pow(10, power);
        }
        return powers[power];
    };
    var decimalAdjust = function(type, num, decimalPlaces) {
        if (type !== 'round')
            return num;
        var p = intpow10(decimalPlaces || 0);
        var n = (num * p) * (1 + Number.EPSILON);
        return Math[type](n) / p;
    };
    return {
        // Decimal round (half away from zero)
        round: function(num, decimalPlaces) {
            return decimalAdjust('round', num, decimalPlaces);
        }
    };
})();

class Producto {
    constructor(id, nombre, precio, cantidad, descripcion, categoria, ruta) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.ruta = ruta;
    }
    
    descuentaStock(cantidad) {
        if (this.cantidad >= cantidad) {
            this.cantidad -= cantidad;
            return true;
        } else {
            console.warn("No cuenta con cantidad suficiente")
            return false;
        }
    }
    incrementaStock(cantidad) {
        this.cantidad += cantidad;
    }
    modificaPrecio(nuevoPrecio) {
        this.precio = nuevoPrecio;
    }
    obtieneTotalArticulo() {
        return this.precio * this.cantidad;
    }
}

class Carrito {
    constructor() {
        this.articulos = [];
    }
    agregaArticulo(producto) {
        this.articulos.push(producto)
    }
    getArticulo(id) {
        return this.articulos.find(elemento => { return elemento.id === id})
    }
    quitaUltimo() {
        return this.articulos.pop();
    }
    getCarrito() {
        return this.articulos;
    }
    quitaArticulo(codigoArticulo) {
        for (let i =0; i< this.articulos.length; i++)
        {
            if ( this.articulos[i].id === codigoArticulo) {
                this.articulos.splice(i, 1);
            }
        }    
    }
    tieneArticulos() {
        return this.articulos.length > 0;
    }
    limpiaCarrito() {
        this.articulos = [];
    }
    calculaTotal() {
        return  this.articulos.reduce((total, n) => total + n.obtieneTotalArticulo(), 0);
    }
    calculaIVA() {
        return decimalesPrecisos.round(this.calculaTotal() * IVA, 2) ;
    }
    carritoaTexto() {
        let result = "Hola, me contacte por tu web y quiero pedirte lo siguiente: \n";
        for (let producto of this.articulos) {
            result += "Producto: " + producto.nombre + " Cantidad: " + producto.cantidad
                        + " Precio Unit: $" + producto.precio + " Total Art: $" + producto.obtieneTotalArticulo() + "\n";
        }
        let subtotalPed = carrito.calculaTotal();
        let pedIVA = carrito.calculaIVA();
        let totalPed = subtotalPed + pedIVA;
        result += "Subtotal pedido: $" + subtotalPed + "\nIVA: $" + pedIVA + "\nTotal: $" + totalPed + "\nGracias."
        
        return result;
    }
}

class Stock {
    constructor() {
        this.articulos = [];
    }
    agregaArticulo(producto) {
        this.articulos.push(producto)
    }
    quitaArticulo(codigoArticulo) {
        for (let i =0; i< this.articulos.length; i++)
        {
            if ( this.articulos[i].id === codigoArticulo) {
                this.articulos.splice(i, 1);
            }
        }    
    }
    quitaUltimo() {
        return this.articulos.pop();
    }
    getArticulo(id) {
        return this.articulos.find(elemento => { return elemento.id === id})
    }
    filtraArticulos(nombre) {
        return this.articulos.filter(elemento => elemento.nombre.toLowerCase().includes(nombre.toLowerCase()));
    }
    filtraArticulosCategoria(categoria) {
        return this.articulos.filter(elemento => (elemento.categoria.toLowerCase()) === (categoria.toLowerCase()));
    }
    getArticulos() {
        return this.articulos;
    }
}

const stock = new Stock();
const carrito = new Carrito();