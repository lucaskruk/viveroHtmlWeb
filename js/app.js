/* Funciones Negocio */

function quitaCarrito(botonQuitar) {
  let fila = botonQuitar.parentNode.parentNode;
  if (fila.hasChildNodes()) 
  {
    let columns = fila.querySelectorAll("td");
    if (columns.length > 0) {
      let idProducto = parseInt(columns[0].innerText) || -1;
      if (idProducto > -1) {
        let prodQuitado =carrito.getArticulo(idProducto);
        let prodEnStock = stock.getArticulo(prodQuitado.id);
        let cantidadQuitada =  parseInt(prodQuitado.cantidad) || -1;
        if (cantidadQuitada > -1) prodEnStock.incrementaStock(cantidadQuitada);
        carrito.quitaArticulo(parseInt(columns[0].innerText));
      }
    }
    botonQuitar.removeEventListener('click', function() {agregaCarrito(element.id)}); 
    fila.remove();
    calculaCarrito();
    guardarCarrito();
    renderCantCarritoNav();
  }
}

function agregaCarrito(codigoArticulo) {
    let cant = prompt("Ingrese la cantidad de este articulo: ");
    let productoenStock = stock.getArticulo(codigoArticulo);
    if (
      typeof productoenStock !== "undefined" &&
      productoenStock.descuentaStock(cant)
    ) {
      let productoCarrito = new Producto(
        productoenStock.id,
        productoenStock.nombre,
        productoenStock.precio,
        cant,
        productoenStock.descripcion,
        productoenStock.categoria,
        productoenStock.ruta
      );
      carrito.agregaArticulo(productoCarrito);
      guardarCarrito();
      renderCantCarritoNav();
    } else {
      alert("La cantidad cargada excede el stock, intente de nuevo por favor");
    }
}


function calculaCarrito() {  
  let subtotal = carrito.calculaTotal();
    let iva = carrito.calculaIVA();
    let total = subtotal + iva;
    renderTotalesCarrito(subtotal, iva, total);
}

function enviarPedidoWP() {
  if (carrito.tieneArticulos()) {
    let mensaje = encodeURIComponent(carrito.carritoaTexto());
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');  
  }
}

/* Funciones inicializacion */

function preCargaProductos() {
    recuperoStock();
    if (stock.articulos.length === 0) {
      producto1 = new Producto(nuevoIDProducto(), "Maceta de Ceramica", 22.5, 50, "Maceta de ceramica 15cm marron", "Macetas", "../img/macetas.jpg");
      producto2 = new Producto(nuevoIDProducto(), "Palma", 30, 30, "Planta de interior, prefiere lugares calidos y humedos.", "Plantas de interior", "../img/PALMA.jpg");
      producto3 = new Producto(nuevoIDProducto(), "Cinta", 15, 50, "Se adapta a lugares con poca luz, riego moderado.", "Plantas de interior", "../img/CCINTA.jpg");
      producto4 = new Producto(nuevoIDProducto(), "Helecho", 80, 20, "Se riega con muy poca frecuencia en invierno.", "Plantas de interior", "../img/HELECHO.jpg");
      producto5 = new Producto(nuevoIDProducto(), "Servicios de Jardineria", 100, 20, "Nos encargamos de que tu jardín o balcon luzca como lo soñabas!", "Servicios", "../img/serviciosJardineria.jpg");
      stock.agregaArticulo(producto1);
      stock.agregaArticulo(producto2);
      stock.agregaArticulo(producto3);
      stock.agregaArticulo(producto4);
      stock.agregaArticulo(producto5);
    }
    prodFiltrados = stock.articulos;
  }
  
  function iniciaPaginas() {
    recuperarCarrito();
    renderCantCarritoNav();
    document.addEventListener('keydown', function(event){ 
      if (event.ctrlKey && event.key === 'm') {
        window.open('/pages/admin.html');
      }
    });
    if (window.location.pathname === "/pages/micarrito.html") {
      renderCarrito();
      const btnEnviarPed = document.querySelector("#enviarPedidoBtn")
      btnEnviarPed.addEventListener("click", enviarPedidoWP);
    }
    if (window.location.pathname === "/pages/admin.html") {
        document.querySelector('#btnAddProd').addEventListener('click', confirmarCargaAdmin, false);
        document.querySelector('#btnSiguiente').addEventListener('click', nextAdminPage, false);
        document.querySelector('#btnPrevio').addEventListener('click', previousAdminPage, false);
        document.querySelectorAll('#tablaAdmin thead tr .ordenable').forEach(t => {
          t.addEventListener('click', ordenaAdmin, false);
        });
        document.querySelector('#btnNuevoProd').addEventListener('click', nuevoProd, false);
        renderAdminPaginado();
    }
    if (window.location.pathname === "/pages/productos.html") {
      document.querySelector('#btnProdSiguiente').addEventListener('click', nextProdPage, false);
      document.querySelector('#btnProdPrevio').addEventListener('click', previousProdPage, false);
      document.querySelector('#btnBuscar').addEventListener('click', filtraNombre, false);
      renderCategoriasList();
      renderProductos(prodFiltrados);
    }
  }

preCargaProductos();
iniciaPaginas();