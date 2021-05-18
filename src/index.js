let listaProductos = ``;
let listaClientes = [];
let carrito = [];
let listadoProductos = [];
let prod = ``;
let listaFiltradaProductos = ``;

// guarda la lista de clientes del local storage en una variable
if (localStorage.getItem('clientes')) {
  listaClientes = JSON.parse(localStorage.getItem('clientes'));
} else {
  localStorage.setItem('clientes', '');
}

const ingresarNombreCliente = () => {
  // let nombreCliente = prompt("Ingrese su nombre: ");
  let nombreCliente = "Mateo";
  let numeroCliente = Math.floor(Math.random() * 1000);
  // crea un objeto nuevo con los datos del cliente y lo agrega al array de clientes
  listaClientes.push(new Cliente(numeroCliente, nombreCliente));
  // guarda la lista actualizada en el local storage
  localStorage.setItem('clientes', JSON.stringify(listaClientes));

  document.getElementById("welcome-message").innerHTML = `Bienvenido ${nombreCliente}!`;
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
    burger.classList.toggle('toggle');
  });
};

// accede a la data del JSON y muestra los productos
$(function() {
  $.getJSON('data.json', function(data) {
    $(() => {
      for(let i = 0; i < data.productos.length; i++) {
        listadoProductos.push(new Producto(data.productos[i].nombre, data.productos[i].precio, data.productos[i].marca, data.productos[i].img));
        listaProductos += `
          <div class="product">
            <img
              class="product-img"
              src="${data.productos[i].img}"
              alt="imagen-del-producto"/>
              <div class="product-info">
                <h3 class="product-title">${data.productos[i].nombre}</h3>
                <h4 class="product-price">$${data.productos[i].precio}</h4>
                <a id="add-cart" onclick="listadoProductos[${i}].agregarAlCarrito(carrito)"><i class="add-cart-icon fas fa-plus-square fa-lg"></i></a>
              </div>
          </div>`;
      };
    });
    document.getElementById("products").innerHTML = listaProductos;
    // filtrarProductos("fiat");
  }).error(function() {
    console.log('error');
  });
});


class Producto {
  constructor(nombre, precio, marca, img) {
    this.nombre = nombre;
    this.precio = precio;
    this.marca = marca;
    this.img = img;
    this.agregarAlCarrito = (carrito) => {
      carrito.push(this);
      console.log("agregaste " + nombre + " al carrito.");
      mostrarCantCarrito();
      actualizarCantCarrito(carrito);
      mostrarMensajeCarrito(this);
    };
  }
}

function mostrarMensajeCarrito (producto) {
  $("#mensaje-carrito").slideDown(400, () => {
    $("#mensaje-carrito").delay(2000).slideUp(400);
  });
  document.getElementById("mensaje-carrito").style.display = "flex";
  document.getElementById("mensaje").innerHTML = "Agregaste " + producto.nombre + " al carrito.";
}

function mostrarCantCarrito () {
  document.getElementById("numero-carrito").style.display = "flex";
}

function actualizarCantCarrito(carrito) {
  document.getElementById("numero").innerHTML = carrito.length;
}


function abrirCarrito() {
  document.getElementById("carrito-container").style.display = "flex";

  if (document.getElementById("carrito-container").style.display === "flex") {
    window.onclick = function(event) {
      if (event.target.id === "carrito-container" && event.target.id != "modulo-carrito") {
        $("#carrito-container").hide();
      }
    }
  }
  cargarCarrito();
}

function cargarCarrito() {
  for (let i = 0; i < carrito.length; i++) {
    prod += `
    <ul class="productos-js">
    <li>${carrito[i].nombre}</li> 
    </ul>
    `
  }
  document.getElementById("produ").innerHTML = prod;
}


// Funcion constructora de objetos Cliente
function Cliente(numeroCliente, nombre) {
  this.numeroCliente = numeroCliente;
  this.nombre = nombre;
}

function generarCardsProductos(arrayDeProductos) {
  listaFiltradaProductos += `
          <div class="product">
            <img
              class="product-img"
              src="${arrayDeProductos.img}"
              alt="imagen-del-producto"/>
              <div class="product-info">
                <h3 class="product-title">${arrayDeProductos.nombre}</h3>
                <h4 class="product-price">$${arrayDeProductos.precio}</h4>
                <a id="add-cart" onclick="${arrayDeProductos}.agregarAlCarrito(carrito)"><i class="add-cart-icon fas fa-plus-square fa-lg"></i></a>
              </div>
          </div>`;
}

// Filtros de productos
function filtrarProductos(marca) {

  for(let i = 0; i < listadoProductos.length; i++) {
    if(listadoProductos[i].marca === marca) {
      console.log(listadoProductos);
      generarCardsProductos(listadoProductos[i]);
    } else if (marca === "todas") {
      generarCardsProductos(listadoProductos[i]);
    };
  };
  document.getElementById("products").innerHTML = listaFiltradaProductos;
  listaFiltradaProductos = ``;
};

// filtra las cards segun la busqueda
$(".active").click( (event) => {
  let idFiltro = event.target.id;
  console.log(idFiltro);
  filtrarProductos(idFiltro);
});

// accede a la barra de busqueda y la guarda en una variable
let searchInput = document.getElementById("search-bar");

searchInput.onkeyup = () => {
  filterSearch(); // TODO: crear funcion para filtrar cards por busqueda.
  console.log(searchInput.value);
};

// Chequea que se haya cargado el DOM antes de ejecutar las funciones
$(document).ready( function() {
  navSlide();
  ingresarNombreCliente();
});
