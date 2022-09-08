function nuevoIDProducto() {
  if (stock.articulos.length === 0) {
    prodId++;
    return prodId;
  } else {
    for (item of stock.articulos) {
      if (parseInt(item.id) > prodId) {
        prodId = parseInt(item.id);
      }
    }
    return prodId +1;
  } 
  
}

/*Funciones de fetch */
async function fetchProductos(){
  let url = "./json/productList.json";
  if (window.location.pathname.includes("pages/")) {
    url = "../json/productList.json";
  }
  let fetchContent;
  await fetch(url).then((response) => response.json())
  .then((json) => fetchContent = json);
  for (elem of fetchContent) {
    prod = new Producto(elem.id, elem.nombre, elem.precio, elem.cantidad, elem.descripcion, elem.categoria, elem.ruta);
    stock.articulos.push(prod);
  }
  guardarStock();
  switch (window.location.pathname) {
    case "/pages/productos.html":
      renderCategoriasList();
      renderProductos(stock.articulos);
    break;
    case "/pages/admin.html":
      renderAdminPaginado();  
    break;
  }

}



/* Funciones Storage */
function guardarStock() {
  const artis = JSON.stringify(stock.articulos);
  window.localStorage.setItem('stock', artis);
}

function recuperoStock() {
  let recuperado = window.localStorage.getItem('stock');
  if (recuperado) {
    const artis = JSON.parse(recuperado);
    stock.articulos = [];
    for (elem of artis) {
      prod = new Producto(elem.id, elem.nombre, elem.precio, elem.cantidad, elem.descripcion, elem.categoria, elem.ruta);
      stock.articulos.push(prod);
    }
  }
}

function guardarCarrito() {
  const cart = JSON.stringify(carrito.articulos);
  window.localStorage.setItem('carrito', cart);
}

function recuperarCarrito() {
  let recuperado = window.localStorage.getItem('carrito');
  if (recuperado) {
    const cart = JSON.parse(recuperado);
    for (elem of cart) {
      prod = new Producto(elem.id, elem.nombre, elem.precio, elem.cantidad, elem.descripcion, elem.categoria, elem.ruta);
      carrito.articulos.push(prod);
    }
  }
}

/* Funciones RENDER */

function renderProductos(articulos) {

  const divProductosCards = document.querySelector("#productosCards");

  divProductosCards.replaceChildren();
  const artsPaginados = articulos.filter((row, index) => {
    let start = (curProdPage-1)*prodPageSize;
    let end =curProdPage*prodPageSize;
    if(index >= start && index < end) return true;
  });

  artsPaginados.forEach(element => {
      const card = document.createElement("div");
      const image = document.createElement("img");
      const cardBody = document.createElement("div");
      const cbH4 = document.createElement("h4");
      const cbH5 = document.createElement("h5");
      const cbP = document.createElement("p");
      const cbFlex = document.createElement("div");
      const cbInput = document.createElement("input");
      const cbButton = document.createElement("button");
      card.className = 'card productosCard';
      image.className = 'card-img-top';
      image.src = element.ruta;
      image.alt = "foto de " + element.nombre;
      cardBody.className = 'card-body';
      cbH4.className = 'card-title';
      cbH4.innerText = element.nombre;
      cbH5.innerText = element.categoria;
      cbP.className = 'card-text';
      cbP.innerText = element.descripcion;
      cbFlex.className='cardBtnDiv';
      const cbLabel = document.createElement('label');
      cbLabel.className = 'cardInputLabel';
      cbLabel.innerText = 'Cantidad: ';
      cbInput.type = 'number';
      cbInput.className = 'cardInput';
      cbButton.className = 'btn btn--verde';
      cbButton.innerText = 'Agregar al carrito';
      cbFlex.append(cbLabel, cbInput, cbButton);
  
      cbButton.addEventListener('click', function() {agregaCarrito(element, this)});
      cardBody.append(cbH4, cbH5, cbP, cbFlex);
      card.append(image, cardBody);

      divProductosCards.append(card);

  });
}

function renderCarrito() {
    const bodyTablaCarrito = document.querySelector("#tablaCarritoBody");
    
    carrito.articulos.forEach(element => {
      const tr = document.createElement("tr");
      const tdID = document.createElement("td");
      const tdNombre = document.createElement("td");
      const tdPrecio = document.createElement("td");
      const tdCant = document.createElement("td");
      const tdSubtotal = document.createElement("td");
      const tdQuitaCarrito = document.createElement("td");
      const btnQuitaCarrito = document.createElement("button");
  
      btnQuitaCarrito.className = "btn btn--azul";
      btnQuitaCarrito.innerText = "Quitar";
      btnQuitaCarrito.addEventListener('click', function() {quitaCarrito(this)});
      tdQuitaCarrito.append(btnQuitaCarrito);
      
      tdID.innerText = element.id;
      tdNombre.innerText = element.nombre;
      tdPrecio.innerText = "$ " + element.precio;
      tdCant.innerText = element.cantidad;
      tdSubtotal.innerText = "$ " + element.obtieneTotalArticulo();
      
      tr.append(tdID, tdNombre, tdPrecio, tdCant, tdSubtotal, tdQuitaCarrito);
  
      bodyTablaCarrito.append(tr);
    });
    calculaCarrito();
}

function renderTotalesCarrito (valorSubtotal, valorIva, valorTotal) {
    const totalesCarritoDiv = document.querySelector("#totalesCarrito");
    totalesCarritoDiv.replaceChildren();
    const subTotal = document.createElement("p");
    const iva = document.createElement("p");
    const total = document.createElement("p");
    subTotal.innerText = `SUBTOTAL: $ ${valorSubtotal}`;
    iva.innerText = `IVA: $ ${valorIva}`;
    total.innerText = `TOTAL: $ ${valorTotal}`;
    totalesCarritoDiv.append( subTotal, iva, total);

}


function renderCantCarritoNav() {
  const carritoLi = document.querySelector('#carritoNav');
  const carritoCant = document.createElement('span');
  carritoCant.id = 'carritoCant';
  carritoCant.innerText = carrito.articulos.length;
  if (carritoLi.childElementCount  > 1) {
    carritoLi.removeChild(carritoLi.lastChild)
  }
  carritoLi.append(carritoCant);
}

function previousProdPage() {
  if(curProdPage > 1) curProdPage--;
  const prodCurPageSpan = document.querySelector('#prodCurrentPage');
  prodCurPageSpan.innerText = curProdPage;
  renderProductos(prodFiltrados);
}

function nextProdPage() {
  if((curProdPage * prodPageSize) < prodFiltrados.length) curProdPage++;
  const prodCurPageSpan = document.querySelector('#prodCurrentPage');
  prodCurPageSpan.innerText = curProdPage;
  renderProductos(prodFiltrados);
}


function renderCategoriasList() {
  const categUl = document.querySelector("#categoriasProd");
  let categoriasArray = stock.articulos.map(elem => elem.categoria);
  let categArraysinDuplicados = [...new Set(categoriasArray)];
  categArraysinDuplicados.forEach(elem => {
    const catLi = document.createElement("li");
    catLi.className = "categoriasList";
    catLi.addEventListener('click', function() {filtraCategoria(elem)}, false);
    catLi.innerText = elem;
    categUl.appendChild(catLi);
  });
}

function filtraCategoria(categoria) {
  prodFiltrados = stock.filtraArticulosCategoria(categoria);
  renderProductos(prodFiltrados);
}

function filtraNombre() {
  const textBusca = document.querySelector("#barraBuscar");
  prodFiltrados = stock.filtraArticulos(textBusca.value);
  renderProductos(prodFiltrados);
}

function muestraMensaje(mensaje) {
  const modal1 = document.querySelector('#modal1');
  modal1.querySelector('#modal1Content').innerText=mensaje;
  modal1.classList.add('is-visible');
  let button = document.querySelector('#closeModal1');
  button.addEventListener ("click", e => {
    document.querySelector(".modal.is-visible").classList.remove('is-visible');
  });
  document.addEventListener("click", e => {
    if (e.target == document.querySelector(".modal.is-visible")) {
      document.querySelector(".modal.is-visible").classList.remove('is-visible');
    }
  });
}

/** Funciones form contacto */

function iniciaMailContacto() {
  document.querySelector('#contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (validaDatosContacto()) {
      emailjs.sendForm('default_service', 'contact_form', this).then(function() {
        muestraMensaje('El correo ha sido enviado. Muchas Gracias');
      }, function(error) {
        console.log('Error al enviar mail: ' + error);
        muestraMensaje('Ups! tuvimos algun problema, intente mas tarde.');
      });
    }
  });
}

function validaDatosContacto() {
  const contactForm = document.querySelector('#contactForm');
  const inputName = contactForm.querySelector('#formName');
  const inputSubject = contactForm.querySelector('#formSubject');
  const inputEmail = contactForm.querySelector('#formEmail');
  const inputMessage = contactForm.querySelector('#formMessage');


  if (inputName.value === "" || inputSubject.value ==="" || inputEmail.value === "" || inputMessage.value === "") {
    muestraMensaje('Debe completar todos los campos primero. Gracias')
    return false;
  }
  else {
    let  validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (inputEmail.value.match(validRegex)) {
      return true;
    } else {
      muestraMensaje("Direccion de correo electronica incorrecta.");
      return false;
    }
    
  }

}