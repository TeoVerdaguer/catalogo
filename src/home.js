let totalCarrito = 0;
let listaClientes = [];
let listaProductos = ``;
let listadoProductos = [];
let listaFiltradaProductos = ``;
let mailCliente = localStorage.getItem("mailCliente");
let nombreCliente = localStorage.getItem("nombreCliente");
let searchInput = document.getElementById("search-bar");
let tablaProdu = document.getElementById("produ").innerHTML;
let productosDeFirebase = [];
const EMAIL_USUARIO = "verdaguermateo@gmail.com";
const MI_EMAIL = "repuestos.pedidos2021@gmail.com";
let arrayCarrito = [];

// accede a la data del JSON y muestra los productos
function getBaseDeDatosDeFirebase(baseDeDatos) {
    for (let i = 0; i < baseDeDatos.length; i++) {
        listadoProductos.push(
            new Producto(
                baseDeDatos[i].nombre,
                baseDeDatos[i].precio,
                baseDeDatos[i].marca,
                baseDeDatos[i].img,
                baseDeDatos[i].stock,
                baseDeDatos[i].codigo
            )
        );
        listaProductos += `
        <div class="product">
          <img
            class="product-img"
            src="/src/img/products/${baseDeDatos[i].img}"
            alt="imagen-del-producto"
            onerror="this.onerror=null;this.src='/src/img/no-img.png';"
            loading="lazy"/>
          <div class="product-info">
            <h3 class="product-title">${baseDeDatos[i].nombre}</h3>
            <h5 class="product-code">${baseDeDatos[i].codigo}</h5>
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
            // console.log(doc.data());
            productosDeFirebase.push(doc.data());
        });
        $("#cargando").hide();
        getBaseDeDatosDeFirebase(productosDeFirebase);
    });

class Producto {
    constructor(nombre, precio, marca, img, stock, codigo) {
        this.nombre = nombre;
        this.precio = precio;
        this.marca = marca;
        this.img = img;
        this.stock = stock;
        this.cantidad = 0;
        this.codigo = codigo;
        this.agregarAlCarrito = () => {
            if (arrayCarrito.length === 0) {
                this.cantidad += 1;
                arrayCarrito.push(this);
            } else {
                if (arrayCarrito.includes(this)) {
                    for (let i = 0; i < arrayCarrito.length; i++) {
                        if (arrayCarrito[i].nombre === this.nombre) {
                            arrayCarrito[i].cantidad += 1;
                        }
                    }
                } else {
                    this.cantidad += 1;
                    arrayCarrito.push(this);
                }
            }

            // if (this.cantidad === 0 && this.stock > 0) {
            //   mostrarMensajeCarrito(this);
            // } else if (this.cantidad < this.stock) {
            //   mostrarMensajeCarrito(this);
            // } else {
            //   mostrarMensajeSinStock();
            // };
            mostrarMensajeCarrito(this); // reemplaza lo de arriba al no usar stock

            mostrarCantCarrito();
            actualizarCantCarrito();

            arrayCarrito.forEach((element) => {
                console.log(element.nombre + " - " + element.cantidad);
            });
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
    ).innerHTML = `Bienvenido/a ${nombreCliente}!`;
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
    arrayCarrito.forEach((elem) => {
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
    arrayCarrito.forEach((element) => {
        if (element.precio === 'S/STOCK') {
            element.precio = 0;
        } else if (element.precio === 'CONSULTAR') {
            element.precio = 0;
        } else {
            element.precio = parseFloat(element.precio);
        }

        tablaProdu += `
      <tr>
        <td class="table-img"><img class="img-prod-carrito" src="/src/img/products/${
            element.img
        }"></td>    
        <td class="nombre-prod-carrito">${element.nombre}</td>
        <td><input class="input-cant-carrito" type="number" min="1" value="${element.cantidad}" required></td>
        <td class="precio-prod">${element.precio * element.cantidad}</td>
        <td><a onclick="" class="borrar-carrito fas fa-times fa-lg"></a></td>
      </tr>
      `;
        totalCarrito += element.precio * element.cantidad;
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
        enviarEmailPedido();
        document.getElementById("boton-enviar-pedido").disabled = "true";
    });
    manejarEventosCarrito();
}

// escucha los cambios en los inputs de cantidad y en los botones de eliminar productos
function manejarEventosCarrito() {
    let productosEnCarrito =
        document.getElementsByClassName("input-cant-carrito");
    for (let i = 0; i < productosEnCarrito.length; i++) {
        productosEnCarrito[i].addEventListener("input", (e) => {
            let nombreElemento =
                e.target.parentElement.parentElement.querySelector(
                    "td.nombre-prod-carrito"
                ).textContent;
            arrayCarrito.forEach((element) => {
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
        let nombreElemento =
            event.target.parentElement.parentElement.querySelector(
                "td.nombre-prod-carrito"
            ).textContent;

        for (let i = 0; i < arrayCarrito.length; i++) {
            if (arrayCarrito[i].nombre === nombreElemento) {
                arrayCarrito.splice(i, 1);
                actualizarTotal();
            }
        }
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

// Envia email con el pedido
function enviarEmailPedido(listado) {
    let precioTotal = 0;
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
    <table>
    <tr>
      <th>Descripcion</th>
      <th>Cantidad</th>
      <th>Precio</th>
    </tr>`;

    for (let i = 0; i < arrayCarrito.length; i++) {
        tabla += `<tr>
      <td>${arrayCarrito[i].nombre}</td>
      <td>${arrayCarrito[i].cantidad}</td>
      <td>${arrayCarrito[i].precio * arrayCarrito[i].cantidad}</td>
      </tr>`;
        precioTotal += arrayCarrito[i].precio * arrayCarrito[i].cantidad;
    }

    tabla += `<tfoot>
      <tr>
        <td><p>TOTAL: $${Number(precioTotal)}</p></td>
        <td></td>
        <td></td>
      </tr>
    </tfoot>
    </table>
    </body>
    </html>`;

    Email.send({
        SecureToken: "0818034a-4302-4a54-8030-80e3807ad74f",
        To: EMAIL_USUARIO,
        From: MI_EMAIL,
        Subject: "Pedido Repuestos",
        Body: tabla,
    }).then((message) => mostrarMensajePedidoEnviado(message));
}

// Muestra un mensaje informando que el pedido fue enviado y loggea el mensaje de SMTPjs en la consola
function mostrarMensajePedidoEnviado(msg) {
    document.getElementById("mensaje-pedido-enviado").style.display = "flex";
    console.log(msg);
}

// Genera el contenido de las cards de los productos filtrados
function generarCardsProductos(i) {
    console.log(listadoProductos);
    listaFiltradaProductos += `
        <div class="product">
          <img
            class="product-img"
            src="/src/img/products/${listadoProductos[i].img}"
            alt="imagen-del-producto"
            onerror="this.onerror=null;this.src='/src/img/no-img.png';"
            loading="lazy"/>
            <div class="product-info">
              <h3 class="product-title">${listadoProductos[i].nombre}</h3>
              <h5 class="product-code">${listadoProductos[i].codigo}</h5>
            </div>
            <div class="logo-marca-container">
              <img src="img/logos/${
                  listadoProductos[i].marca
              }-logo.png" class="logo-img">
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
        console.log(listadoProductos[i].marca);
        if ((listadoProductos[i].marca).toUpperCase() === marca.toUpperCase()) {
            console.log('test');
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
    let valorLower = valor.toLowerCase();
    for (let i = 0; i < listadoProductos.length; i++) {
        if (
            (listadoProductos[i].nombre).toLowerCase().includes(valorLower) ||
            listadoProductos[i].codigo.toLowerCase().includes(valorLower)
        ) {
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
        localStorage.getItem("mailCliente") === "" ||
        !localStorage.getItem("mailCliente")
    ) {
        location.href = "index.html";
    } else {
        mailCliente = localStorage.getItem("mailCliente");
    }

    document
        .getElementById("btn-cerrar-sesion")
        .addEventListener("click", () => {
            localStorage.setItem("mailCliente", "");
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
