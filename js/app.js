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

function agregaCarrito(producto, botonAgregar) {
    const cantInput = botonAgregar.parentNode.querySelector('input');
    let cant = cantInput.value;
    cantInput.value = "";
    if (cant > 0) {
      if (
        typeof producto !== "undefined" &&
        producto.descuentaStock(cant)
      ) {
        let productoCarrito = new Producto(
          producto.id,
          producto.nombre,
          producto.precio,
          cant,
          producto.descripcion,
          producto.categoria,
          producto.ruta
        );
        carrito.agregaArticulo(productoCarrito);
        guardarCarrito();
        renderCantCarritoNav();
        muestraMensaje("Articulo agregado al carrito.");
      } else {
        muestraMensaje('La cantidad seleccionada excede el stock disponible. Elija un numero inferior.')
      }
  } else {
    muestraMensaje('La cantidad tiene que ser mayor que cero.')
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
      fetchProductos();
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

    switch (window.location.pathname) {
      case "/pages/micarrito.html":
        renderCarrito();
        const btnEnviarPed = document.querySelector("#enviarPedidoBtn")
        btnEnviarPed.addEventListener("click", enviarPedidoWP);    
      break;
      case "/pages/admin.html":
        document.querySelector('#btnAddProd').addEventListener('click', confirmarCargaAdmin, false);
        document.querySelector('#btnSiguiente').addEventListener('click', nextAdminPage, false);
        document.querySelector('#btnPrevio').addEventListener('click', previousAdminPage, false);
        document.querySelectorAll('#tablaAdmin thead tr .ordenable').forEach(t => {
          t.addEventListener('click', ordenaAdmin, false);
        });
        document.querySelector('#btnNuevoProd').addEventListener('click', nuevoProd, false);
        renderAdminPaginado();
      break;
      case "/pages/productos.html":
        document.querySelector('#btnProdSiguiente').addEventListener('click', nextProdPage, false);
        document.querySelector('#btnProdPrevio').addEventListener('click', previousProdPage, false);
        document.querySelector('#btnBuscar').addEventListener('click', filtraNombre, false);
        renderCategoriasList();
        renderProductos(prodFiltrados);
      break;
      case "/pages/contacto.html":
        emailjs.init('tmqA6HFdyCwNGrbqG');
        iniciaMailContacto();
      break;
    }
  }

preCargaProductos();
iniciaPaginas();