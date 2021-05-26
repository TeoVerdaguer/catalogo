let listaProductos = ``;
let listaClientes = [];
let carrito = [];
let listadoProductos = [];
let listaFiltradaProductos = ``;
let tablaProdu = document.getElementById("produ").innerHTML;

// guarda la lista de clientes del local storage en una variable
if (localStorage.getItem('clientes')) {
  listaClientes = JSON.parse(localStorage.getItem('clientes'));
} else {
  localStorage.setItem('clientes', '');
}

$("#boton-login").on("click", () => {
  $("#modal-login").hide();
});

const mostrarLogin = () => {
  // $("#modal-login").show;
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
                <a id="add-cart" onclick="listadoProductos[${i}].agregarAlCarrito()"><i class="add-cart-icon fas fa-plus-square fa-lg"></i></a>
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

function mostrarMensajeCarrito (producto) {
  $("#mensaje-carrito").slideDown(400, () => {
    $("#mensaje-carrito").delay(1000).slideUp(400);
  });
  document.getElementById("mensaje-carrito").style.display = "flex";
  document.getElementById("mensaje").innerHTML = "Agregaste " + producto.nombre + " al carrito.";
}

function mostrarCantCarrito () {
  document.getElementById("numero-carrito").style.display = "flex";
}

function actualizarCantCarrito() {
  let cantCarrito = 0;
  listadoProductos.forEach( (elem) => {
    if(elem.cantidad > 0) {
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
    window.onclick = function(event) {
      if (event.target.id === "carrito-container" && event.target.id != "modulo-carrito") {
        document.getElementById("produ").innerHTML = `
        <tr>
          <th>Descripcion</th>
          <th>Cantidad</th>
          <th>Precio</th>
        </tr>`;
        tablaProdu = document.getElementById("produ").innerHTML;
        $("#carrito-container").hide();
      }
    }
  }
}

function cargarCarrito() {
  // foreach in carrito if cant > 0 mostrar
  listadoProductos.forEach( (element) => {
      if(element.cantidad > 0){
        tablaProdu += `
        <tr>
          <td>${element.nombre}</td>
          <td>${element.cantidad}</td>
          <td>${element.precio * element.cantidad}</td>
          <td><a onclick="" class="borrar-carrito fas fa-times fa-lg"></a></td>
        </tr>
        `
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
              alt="imagen-del-producto"/>
              <div class="product-info">
                <h3 class="product-title">${listadoProductos[i].nombre}</h3>
                <h4 class="product-price">$${listadoProductos[i].precio}</h4>
                <a id="add-cart" onclick="listadoProductos[${i}].agregarAlCarrito()"><i class="add-cart-icon fas fa-plus-square fa-lg"></i></a>
              </div>
          </div>`;
}

// Filtros de productos
function filtrarProductos(marca) {

  for(let i = 0; i < listadoProductos.length; i++) {
    if(listadoProductos[i].marca === marca) {
      generarCardsProductos(i);
    } else if (marca === "todas") {
      generarCardsProductos(i);
    };
  };
  document.getElementById("products").innerHTML = listaFiltradaProductos;
  listaFiltradaProductos = ``;
};

// filtra las cards
$(".active").click( (event) => {
  let idFiltro = event.target.id;
  filtrarProductos(idFiltro);
});

// accede a la barra de busqueda y la guarda en una variable
let searchInput = document.getElementById("search-bar");

// searchInput.addEventListener("keyup", (event) => {
//   if (event.key === "Enter") {
//     filtrarPorBusqueda(searchInput.value);
//   }
// })
searchInput.onkeyup = () => {
  filtrarPorBusqueda(searchInput.value);
};

// filtra las cards de acuerdo al contenido de la busqueda
function filtrarPorBusqueda(valor) {

  for(let i = 0; i < listadoProductos.length; i++) {
    if((listadoProductos[i].nombre).toLowerCase().includes(valor)){
      generarCardsProductos(listadoProductos[i]);
    } else if (valor === "") {
      generarCardsProductos(listadoProductos[i]);
    }
  }
  document.getElementById("products").innerHTML = listaFiltradaProductos;
  listaFiltradaProductos = ``;
}

function expandirCuenta() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var abrirDropdown = dropdowns[i];
      if (abrirDropdown.classList.contains('show')) {
        abrirDropdown.classList.remove('show');
      }
    }
  }
}

$(document).ready( function() {
  navSlide();
  mostrarLogin();
});
