let listaProductos = ``;
let listaClientes = [];
let carrito = [];
let listadoProductos = [];
let listaFiltradaProductos = ``;
let clientes = [123, 456, 789];
let numCliente = "";
let tablaProdu = document.getElementById("produ").innerHTML;


$("#boton-login").on("click", () => {
  login();
});

$("#username-input").on("keyup", (event) => {
  if (event.keyCode === 13) {
    login();
  }
});

if (localStorage.getItem("numCliente") === "" || !localStorage.getItem("numCliente")) {
  location.href = "index.html";
} else {
  numCliente = JSON.parse(localStorage.getItem("numCliente"));
}

document.getElementById("btn-cerrar-sesion").addEventListener("click", () => {
  localStorage.setItem("numCliente", "");
});

const mostrarMensajeLogin = () => {
  document.getElementById(
    "welcome-message"
  ).innerHTML = `Bienvenido ${numCliente}!`;
};

// animacion del burger menu (mobile)
const navSlide = () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav-links");
  const navLinks = document.querySelectorAll(".nav-links li");

  burger.addEventListener("click", () => {
    // toggle nav
    nav.classList.toggle("nav-active");

    // animacion de links
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
};

// accede a la data del JSON y muestra los productos
$(function () {
  $.getJSON("data.json", function (data) {
    $(() => {
      for (let i = 0; i < data.productos.length; i++) {
        listadoProductos.push(
          new Producto(
            data.productos[i].nombre,
            data.productos[i].precio,
            data.productos[i].marca,
            data.productos[i].img
          )
        );
        listaProductos += `
        <div class="product">
          <img
            class="product-img"
            src="${data.productos[i].img}"
            alt="imagen-del-producto
            loading="lazy"/>
            <div class="product-info">
              <h3 class="product-title">${data.productos[i].nombre}</h3>
              <h4 class="product-price">$${data.productos[i].precio}</h4>
              <a id="add-cart" onclick="listadoProductos[${i}].agregarAlCarrito()"><i class="add-cart-icon fas fa-plus-square fa-lg"></i></a>
            </div>
        </div>`;
      }
    });
    document.getElementById("products").innerHTML = listaProductos;
  }).error(function () {
    console.log("error");
  });
});

class Producto {
  constructor(nombre, precio, marca, img) {
    this.nombre = nombre;
    this.precio = precio;
    this.marca = marca;
    this.img = img;
    this.cantidad = 0;
    this.agregarAlCarrito = () => {
      if (this.cantidad === 0) {
        this.cantidad += 1;
        carrito.push(this);
      } else {
        this.cantidad += 1;
      }
      carrito.push(this);
      mostrarCantCarrito();
      actualizarCantCarrito();
      mostrarMensajeCarrito(this);
    };
  }
}

function mostrarMensajeCarrito(producto) {
  $("#mensaje-carrito").slideDown(400, () => {
    $("#mensaje-carrito").delay(1000).slideUp(400);
  });
  document.getElementById("mensaje-carrito").style.display = "flex";
  document.getElementById("mensaje").innerHTML =
    "Agregaste " + producto.nombre + " al carrito.";
}

function mostrarCantCarrito() {
  document.getElementById("numero-carrito").style.display = "flex";
}

function actualizarCantCarrito() {
  let cantCarrito = 0;
  listadoProductos.forEach((elem) => {
    if (elem.cantidad > 0) {
      cantCarrito += elem.cantidad;
    }
  });

  document.getElementById("numero").innerHTML = cantCarrito;
}

function abrirCarrito() {
  document.getElementById("carrito-container").style.display = "flex";

  cargarCarrito();
  cerrarCarrito();
}

// cerrar carrito
function cerrarCarrito() {
  if (document.getElementById("carrito-container").style.display === "flex") {
    window.onclick = function (event) {
      if (
        event.target.id === "carrito-container" &&
        event.target.id != "modulo-carrito"
      ) {
        document.getElementById("produ").innerHTML = `
      <tr>
        <th>Descripcion</th>
        <th>Cantidad</th>
        <th>Precio</th>
      </tr>`;
        tablaProdu = document.getElementById("produ").innerHTML;
        $("#carrito-container").hide();
      }
    };
  }
}

function cargarCarrito() {
  // foreach in carrito if cant > 0 mostrar
  listadoProductos.forEach((element) => {
    if (element.cantidad > 0) {
      tablaProdu += `
      <tr>
        <td><img class="img-prod-carrito" src="${element.img}"></td>    
        <td>${element.nombre}</td>
        <td><input type="number" min="1"></td>
        <td>${element.precio * element.cantidad}</td>
        <td><a onclick="" class="borrar-carrito fas fa-times fa-lg"></a></td>
      </tr>
      `;
    }
  });

  document.getElementById("produ").innerHTML = tablaProdu;

  $(".borrar-carrito").on("click", (event) => {
    var boton = event.target;
    boton.parentElement.parentElement.remove();
  });
}
 
// Funcion constructora de objetos Cliente
function Cliente(numeroCliente, nombre) {
  this.numeroCliente = numeroCliente;
  this.nombre = nombre;
}

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
              <h4 class="product-price">$${listadoProductos[i].precio}</h4>
              <a id="add-cart" onclick="listadoProductos[${i}].agregarAlCarrito()"><i class="add-cart-icon fas fa-plus-square fa-lg"></i></a>
            </div>
        </div>`;
}

// Filtros de productos
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

// filtra las cards
$(".active").click((event) => {
  let idFiltro = event.target.id;
  filtrarProductos(idFiltro);
});

// accede a la barra de busqueda y la guarda en una variable
let searchInput = document.getElementById("search-bar");

searchInput.onkeyup = () => {
  filtrarPorBusqueda(searchInput.value);
};

// filtra las cards de acuerdo al contenido de la busqueda
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

function expandirCuenta() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var abrirDropdown = dropdowns[i];
      if (abrirDropdown.classList.contains("show")) {
        abrirDropdown.classList.remove("show");
      }
    }
  }
};

mostrarMensajeLogin();

$(document).ready(function () {
  navSlide();
  
});
