let listaProductos = ``;
let listaClientes = [];
let carrito = [];
let listadoProductos = [];

// guarda la lista de clientes del local storage en una variable
if (localStorage.getItem('clientes')) {
  listaClientes = JSON.parse(localStorage.getItem('clientes'));
} else {
  localStorage.setItem('clientes', '');
}

const ingresarNombreCliente = () => {
  let nombreCliente = prompt("Ingrese su nombre: ");
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
        listadoProductos.push(new Producto(data.productos[i].nombre, data.productos[i].precio));
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
  }).error(function() {
    console.log('error');
  });
});


class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
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
  document.getElementById("mensaje-carrito").style.display = "flex";
  document.getElementById("mensaje").innerHTML = "Agregaste " + producto.nombre + " al carrito.";
}

function mostrarCantCarrito () {
  document.getElementById("numero-carrito").style.display = "flex";
}

function actualizarCantCarrito(carrito) {
  document.getElementById("numero").innerHTML = carrito.length;
}

// Funcion constructora de objetos Cliente
function Cliente(numeroCliente, nombre) {
  this.numeroCliente = numeroCliente;
  this.nombre = nombre;
}

// TODO: filtra las cards segun la busqueda
function filterSearch() {
  return true;
};

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
