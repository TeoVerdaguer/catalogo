let listaProductos = ``;
// guarda la lista de clientes del local storage en una variable
let listaClientes = JSON.parse(localStorage.getItem('clientes'));

const ingresarNombreCliente = () => {
  let nombreCliente = prompt("Ingrese su nombre: ");
  let numeroCliente = Math.floor(Math.random() * 1000);
  // crea un objeto nuevo con los datos del cliente y lo agrega al array de clientes
  listaClientes.push(new Cliente(numeroCliente, nombreCliente));
  // guarda la lista actualizada en el local storage
  localStorage.setItem('clientes', JSON.stringify(listaClientes));

  console.log(JSON.parse(localStorage.getItem('clientes')));
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
    console.log(data.productos);
    console.log(data.productos.length);
    $(() => {
      for(let i = 0; i < data.productos.length; i++) {
        console.log('vuelta ' + i);
        listaProductos += `
          <div class="product">
            <img
              class="product-img"
              src="${data.productos[i].img}"
              alt="imagen-del-producto"/>
              <div class="product-info">
                <h3 class="product-title">${data.productos[i].nombre}</h3>
                <h4 class="product-price">$${data.productos[i].precio}</h4>
              </div>
          </div>`;
        console.log(data.productos[i]);
        // $('ul').append('<li>' + data.productos[i].nombre + ' ' + data.productos[i].precio + '</li>');
        };
    });
    document.getElementById("productos").innerHTML = listaProductos;
  }).error(function() {
    console.log('error');
  });
});

function onInit() {
  navSlide();

  ingresarNombreCliente();
  console.log(listaProductos);

  console.log('lista de productos ' + listaProductos);

}

/** Crea funcion constructora de objetos */
function Cliente(numeroCliente, nombre) {
  this.numeroCliente = numeroCliente;
  this.nombre = nombre;
}

onInit();