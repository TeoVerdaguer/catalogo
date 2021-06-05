let carrito = [];
let totalCarrito = 0;
let listaClientes = [];
let listaProductos = ``;
let listadoProductos = [];
let clientes = [123, 456, 789];
let listaFiltradaProductos = ``;
let numCliente = localStorage.getItem("numCliente");
let searchInput = document.getElementById("search-bar");
let tablaProdu = document.getElementById("produ").innerHTML;


// muestra el nombre del cliente en el mensaje de bienvenida
function mostrarMensajeLogin() {
  document.getElementById(
    "welcome-message"
  ).innerHTML = `Bienvenido/a ${numCliente}!`;
};

// animacion del burger menu (mobile)
function navSlide() {
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
            data.productos[i].img,
            data.productos[i].stock
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
        carrito.push(this);
        mostrarMensajeCarrito(this);
      } else if (this.cantidad < this.stock) {
        this.cantidad += 1;
        mostrarMensajeCarrito(this);
      } else {
        mostrarMensajeSinStock();
      }
      carrito.push(this);
      mostrarCantCarrito();
      actualizarCantCarrito();
    };
  }
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
  console.log(cantCarrito);
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
      <tr>
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
}


// genera el contenido del modal del carrito
function cargarCarrito() {
  listadoProductos.forEach((element) => {
    if (element.cantidad > 0) {
      tablaProdu += `
      <tr>
        <td><img class="img-prod-carrito" src="${element.img}"></td>    
        <td class="nombre-prod-carrito">${element.nombre}</td>
        <td><input class="input-cant-carrito" type="number" min="1" max="${element.stock}" value="${element.cantidad}" required></td>
        <td>${element.precio * element.cantidad}</td>
        <td><a onclick="" class="borrar-carrito fas fa-times fa-lg"></a></td>
      </tr>
      `;

      totalCarrito += element.precio * element.cantidad;
    }
    // element.cantidad = parseInt(document.getElementById("input-cant-carrito").value);
  });

  tablaProdu += `

  <tfoot class="footer-tabla-carrito">
    <tr>
      <td></td>
      <td><p>TOTAL: $${totalCarrito}</p></td>
      <td><button class="boton-carrito">Pagar</button></td>
      <td><button class="boton-carrito">Enviar Pedido</button></td>
    </tr>
  </tfoot>
  `;

  document.getElementById("produ").innerHTML = tablaProdu;

  let productosEnCarrito = document.getElementsByClassName("input-cant-carrito");

  for (let i = 0; i < productosEnCarrito.length; i++) {
    productosEnCarrito[i].addEventListener("input", (e) => {
      let nombreElemento = e.target.parentElement.parentElement.querySelector("td.nombre-prod-carrito").textContent;
      console.log(e.target.parentElement.parentElement.querySelector("td.nombre-prod-carrito").textContent);
      listadoProductos.forEach( (element) => {
        if (element.nombre === nombreElemento) {
          element.cantidad = Number(document.querySelector(".input-cant-carrito").value);
          console.log(element);
        }
      });

      actualizarCantCarrito();
      console.log("actualizaste el carrito");
    });
  };
  
  $(".borrar-carrito").on("click", (event) => {
    var boton = event.target;
    boton.parentElement.parentElement.remove();
    let nombreElemento = event.target.parentElement.parentElement.querySelector("td.nombre-prod-carrito").textContent;

    listadoProductos.forEach( (element) => {
      if (element.nombre === nombreElemento) {
        element.cantidad = 0;
        console.log(element);
      }
    });
    actualizarCantCarrito();
  });
}
 



// Funcion constructora de objetos Cliente
function Cliente(numeroCliente, nombre) {
  this.numeroCliente = numeroCliente;
  this.nombre = nombre;
}

// genera el contenido de las cards de los productos
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
  
  if (localStorage.getItem("numCliente") === "" || !localStorage.getItem("numCliente")) {
    location.href = "index.html";
  } else {
    numCliente = JSON.parse(localStorage.getItem("numCliente"));
  }
  
  document.getElementById("btn-cerrar-sesion").addEventListener("click", () => {
    localStorage.setItem("numCliente", "");
  });
  
  // filtra las cards
  $(".active").click((event) => {
    let idFiltro = event.target.id;
    filtrarProductos(idFiltro);
  });
  
  searchInput.onkeyup = () => {
    filtrarPorBusqueda(searchInput.value.toLowerCase());
  };
  
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
});
