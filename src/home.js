let totalCarrito = 0;
let listaClientes = [];
let listaProductos = ``;
let listadoProductos = [];
let clientes = [123, 456, 789];
let listaFiltradaProductos = ``;
let numCliente = localStorage.getItem("numCliente");
let searchInput = document.getElementById("search-bar");
let tablaProdu = document.getElementById("produ").innerHTML;
let productosDeFirebase = [];
const FIREBASE_DB = firebase.firestore();
const EMAIL_USUARIO = "verdaguermateo@gmail.com";
const MI_EMAIL = "repuestos.pedidos2021@gmail.com";

// accede a la data del JSON y muestra los productos
function getBaseDeDatosDeFirebase(baseDeDatos) {
  for (let i = 0; i < baseDeDatos.length; i++) {
    listadoProductos.push(
      new Producto(
        baseDeDatos[i].nombre,
        baseDeDatos[i].precio,
        baseDeDatos[i].marca,
        baseDeDatos[i].img,
        baseDeDatos[i].stock
      )
    );
    listaProductos += `
        <div class="product">
          <img
            class="product-img"
            src="${baseDeDatos[i].img}"
            alt="imagen-del-producto
            loading="lazy"/>
          <div class="product-info">
            <h3 class="product-title">${baseDeDatos[i].nombre}</h3>
          </div>
          <div class="logo-marca-container">
            <img src="img/logos/${baseDeDatos[i].marca}-logo.png" class="logo-img">
            <div class="precio-container">
              <h4 class="product-price">$${baseDeDatos[i].precio}</h4>
              <a id="add-cart" onclick="listadoProductos[${i}].agregarAlCarrito()"><i class="add-cart-icon fas fa-plus-square fa-lg"></i></a>
            </div>
          </div>
        </div>`;
  }
  document.getElementById("products").innerHTML = listaProductos;
}

// Access 'productos' from database
FIREBASE_DB.collection("productos")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      productosDeFirebase.push(doc.data());
    });
    $("#cargando").hide();
    getBaseDeDatosDeFirebase(productosDeFirebase);
  });

class Producto {
  constructor(nombre, precio, marca, img, stock) {
    this.nombre = nombre;
    this.precio = precio;
    this.marca = marca;
    this.img = img;
    this.stock = stock;
    this.cantidad = 0;
    this.agregarAlCarrito = () => {
      if (this.cantidad === 0 && this.stock > 0) {
        this.cantidad += 1;
        mostrarMensajeCarrito(this);
      } else if (this.cantidad < this.stock) {
        this.cantidad += 1;
        mostrarMensajeCarrito(this);
      } else {
        mostrarMensajeSinStock();
      }
      mostrarCantCarrito();
      actualizarCantCarrito();
    };
  }
}

// animacion del burger menu (mobile)
function navSlide() {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav-links");
  const navLinks = document.querySelectorAll(".nav-links li");

  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");

    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = "";
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${
          index / 7 + 0.5
        }s`;
      }
    });
    burger.classList.toggle("toggle");
  });
}

// muestra u oculta el dropdown de Cuenta para cerrar sesion
document.getElementById("btn-cuenta").onclick = () => {
  let dropdown = document.getElementById("dropdown-cuenta");

  if (dropdown.classList.contains("show")) {
    dropdown.classList.remove("show");
  } else {
    dropdown.classList.add("show");
  }
};

// muestra el nombre del cliente en el mensaje de bienvenida
function mostrarMensajeLogin() {
  document.getElementById(
    "welcome-message"
  ).innerHTML = `Bienvenido/a ${numCliente}!`;
}

// muestra un mensaje avisando que se agrego un producto al carrito
function mostrarMensajeCarrito(producto) {
  document.getElementById("mensaje-carrito").classList.remove("sin-stock");
  $("#mensaje-carrito").slideDown(400, () => {
    $("#mensaje-carrito").delay(1000).slideUp(400);
  });
  document.getElementById("mensaje-carrito").style.display = "flex";
  document.getElementById("mensaje").innerHTML =
    "Agregaste " + producto.nombre + " al carrito.";
}

// muestra un mensaje cuando se intenta agregar un producto sin stock
function mostrarMensajeSinStock() {
  $("#mensaje-carrito").slideDown(400, () => {
    $("#mensaje-carrito").delay(1000).slideUp(400);
  });
  document.getElementById("mensaje-carrito").style.display = "flex";
  document.getElementById("mensaje-carrito").classList.add("sin-stock");
  document.getElementById("mensaje").innerHTML =
    "Disculpe. No tenemos mas stock en este momento.";
}

// muestra el numero del carrito cuando se agrega el primer producto
function mostrarCantCarrito() {
  document.getElementById("numero-carrito").style.display = "flex";
}

// ocultar el numero del carrito cuando la cantidad de productos sea = 0
function ocultarCantCarrito() {
  document.getElementById("numero-carrito").style.display = "none";
}

// actualiza el numero del carrito con la cantidad de productos agregados
function actualizarCantCarrito() {
  let cantCarrito = 0;
  listadoProductos.forEach((elem) => {
    cantCarrito += elem.cantidad;
  });
  if (cantCarrito === 0) {
    ocultarCantCarrito();
  }
  document.getElementById("numero").innerHTML = Number(cantCarrito);
}

// muestra el modal del carrito
function abrirCarrito() {
  document.getElementById("carrito-container").style.display = "flex";
  cargarCarrito();
  cerrarCarrito();
}

// oculta el modal del carrito al hacer click fuera del mismo
function cerrarCarrito() {
  if (document.getElementById("carrito-container").style.display === "flex") {
    window.onclick = function (event) {
      if (
        event.target.id === "carrito-container" &&
        event.target.id != "modulo-carrito"
      ) {
        document.getElementById("produ").innerHTML = `
      <tr class="table-titles">
        <th></th>
        <th>Descripcion</th>
        <th>Cantidad</th>
        <th>Precio</th>
        <th>Eliminar</th>
      </tr>`;
        tablaProdu = document.getElementById("produ").innerHTML;
        $("#carrito-container").hide();
      }
    };
    totalCarrito = 0;
  }
  // Event listener to fix close button not working in safari mobile
  document.getElementById("close-carrito").addEventListener("click", () => {
    $("#carrito-container").hide();
    document.getElementById("produ").innerHTML = `
      <tr class="table-titles">
        <th></th>
        <th>Descripcion</th>
        <th>Cantidad</th>
        <th>Precio</th>
        <th>Eliminar</th>
      </tr>`;
    tablaProdu = document.getElementById("produ").innerHTML;
    $("#carrito-container").hide();
  });
}

// genera el contenido del modal del carrito
function cargarCarrito() {
  listadoProductos.forEach((element) => {
    if (element.cantidad > 0) {
      tablaProdu += `
      <tr>
        <td class="table-img"><img class="img-prod-carrito" src="${
          element.img
        }"></td>    
        <td class="nombre-prod-carrito">${element.nombre}</td>
        <td><input class="input-cant-carrito" type="number" min="1" max="${
          element.stock
        }" value="${element.cantidad}" required></td>
        <td class="precio-prod">${element.precio * element.cantidad}</td>
        <td><a onclick="" class="borrar-carrito fas fa-times fa-lg"></a></td>
      </tr>
      `;
      totalCarrito += element.precio * element.cantidad;
    }
  });

  tablaProdu += `
  <tfoot class="footer-tabla-carrito">
    <tr>
      <td class="table-total"></td>
      <td><p class="precio-total">TOTAL: $${totalCarrito}</p></td>
      <td></td>
      <td class="table-boton"></td>
    </tr>
  </tfoot>
  `;
  document.getElementById("produ").innerHTML = tablaProdu;
  document.querySelector(".boton-carrito").addEventListener("click", () => {
    document.getElementById("mensaje-pedido-enviado").style.display = "flex";
    document.getElementById("boton-enviar-pedido").disabled = "true";
    enviarEmailPedido(tablaProdu);
  });
  manejarEventosCarrito();
}

// escucha los cambios en los inputs de cantidad y en los botones de eliminar productos
function manejarEventosCarrito() {
  let productosEnCarrito =
    document.getElementsByClassName("input-cant-carrito");
  for (let i = 0; i < productosEnCarrito.length; i++) {
    productosEnCarrito[i].addEventListener("input", (e) => {
      let nombreElemento = e.target.parentElement.parentElement.querySelector(
        "td.nombre-prod-carrito"
      ).textContent;
      listadoProductos.forEach((element) => {
        if (element.nombre === nombreElemento) {
          element.cantidad = Number(
            e.target.parentElement.parentElement.querySelector(
              ".input-cant-carrito"
            ).value
          );
          e.target.parentElement.parentElement.querySelector(
            "td.precio-prod"
          ).textContent = element.precio * element.cantidad;
          actualizarTotal();
        }
      });
      actualizarCantCarrito();
    });
  }
  $(".borrar-carrito").on("click", (event) => {
    var boton = event.target;
    boton.parentElement.parentElement.remove();
    let nombreElemento = event.target.parentElement.parentElement.querySelector(
      "td.nombre-prod-carrito"
    ).textContent;

    listadoProductos.forEach((element) => {
      if (element.nombre === nombreElemento) {
        element.cantidad = 0;
        actualizarTotal();
      }
    });
    actualizarCantCarrito();
  });
}

function actualizarTotal() {
  let total = 0;
  let precios = document.getElementsByClassName("precio-prod");

  for (let i = 0; i < precios.length; i++) {
    total += Number(precios[i].textContent);
  }
  document.querySelector("p.precio-total").textContent = `TOTAL: $${total}`;
}

// Funcion constructora de objetos Cliente
function Cliente(numeroCliente, nombre) {
  this.numeroCliente = numeroCliente;
  this.nombre = nombre;
}

// Envia email con el pedido
function enviarEmailPedido(listado) {
  let tabla = `
  <html>
  <head>
  <style type="text/css">
  table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
  }
  th, td {
    padding: 0 10px;
  }
  </style>
  </head>
  <body>
  <table>`;

  Email.send({
    SecureToken: "0818034a-4302-4a54-8030-80e3807ad74f",
    To: EMAIL_USUARIO,
    From: MI_EMAIL,
    Subject: "Pedido Repuestos",
    Body: tabla + listado + `</table></body></html>`
  }).then((message) => console.log(message));
}

// Genera el contenido de las cards de los productos filtrados
function generarCardsProductos(i) {
  listaFiltradaProductos += `
        <div class="product">
          <img
            class="product-img"
            src="${listadoProductos[i].img}"
            alt="imagen-del-producto"
            loading="lazy"/>
            <div class="product-info">
              <h3 class="product-title">${listadoProductos[i].nombre}</h3>
            </div>
            <div class="logo-marca-container">
              <img src="img/logos/${listadoProductos[i].marca}-logo.png" class="logo-img">
              <div class="precio-container">
                <h4 class="product-price">$${listadoProductos[i].precio}</h4>
                <a id="add-cart" onclick="listadoProductos[${i}].agregarAlCarrito()"><i class="add-cart-icon fas fa-plus-square fa-lg"></i></a>
              </div>
            </div>
        </div>`;
}

// filtra los productos de acuerdo a la marca seleccionada
function filtrarProductos(marca) {
  for (let i = 0; i < listadoProductos.length; i++) {
    if (listadoProductos[i].marca === marca) {
      generarCardsProductos(i);
    } else if (marca === "todas") {
      generarCardsProductos(i);
    }
  }

  document.getElementById("products").innerHTML = listaFiltradaProductos;
  listaFiltradaProductos = ``;
}

// filtra las cards de acuerdo al texto de la busqueda
function filtrarPorBusqueda(valor) {
  for (let i = 0; i < listadoProductos.length; i++) {
    if (listadoProductos[i].nombre.toLowerCase().includes(valor)) {
      generarCardsProductos(i);
    } else if (valor === "") {
      generarCardsProductos(i);
    }
  }
  document.getElementById("products").innerHTML = listaFiltradaProductos;
  listaFiltradaProductos = ``;
}

// muestra u oculta el dropdown de cuenta para cerrar sesión
function expandirCuenta() {
  document.getElementById("myDropdown").classList.toggle("show");
}

$(document).ready(function () {
  navSlide();
  mostrarMensajeLogin();

  $("#boton-login").on("click", () => {
    login();
  });

  $("#username-input").on("keyup", (event) => {
    if (event.keyCode === 13) {
      login();
    }
  });

  if (
    localStorage.getItem("numCliente") === "" ||
    !localStorage.getItem("numCliente")
  ) {
    location.href = "index.html";
  } else {
    numCliente = JSON.parse(localStorage.getItem("numCliente"));
  }

  document.getElementById("btn-cerrar-sesion").addEventListener("click", () => {
    localStorage.setItem("numCliente", "");
  });

  // al apretar en una marca ejectuta la funcion de filtrar las cards
  $(".active").click((event) => {
    let idFiltro = event.target.id;
    filtrarProductos(idFiltro);
  });

  // filtra las cards con el texto ingresado en la barra de busqueda
  searchInput.onkeyup = () => {
    filtrarPorBusqueda(searchInput.value.toLowerCase());
  };
});
