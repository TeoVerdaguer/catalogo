const FIREBASE_DB = firebase.firestore();
let productosDeFirebase = [];
let listaProductos = ``;
let listadoProductos = [];

$("#boton-volver").on("click", () => {
  location.href = "/src/admin-panel.html";
});

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
        [i]
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
          </div>
          <div>
            <h4 class="product-stock">Stock: ${baseDeDatos[i].stock}</h4>
          </div>
          <a id="delete-item" onclick="listadoProductos[${i}].borrar(this)"><i class="delete-item-icon fas fa-trash fa-lg"></i></a>
        </div>
      </div>`;
  }
  document.getElementById("products").innerHTML = listaProductos;
}

function mostrarMensajeBorrado(origen) {
  console.log('producto borrado exitosamente.');
  $('#mensaje-borrado').slideDown(400, () => {
    $("#mensaje-borrado").delay(1000).slideUp(400);
  });
  console.log(origen.parentElement);
  $(origen.parentElement.parentElement).fadeOut();
}; 

// Access 'productos' from database
FIREBASE_DB.collection("productos")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      productosDeFirebase.push(doc.data());
    });
    getBaseDeDatosDeFirebase(productosDeFirebase);
  });

class Producto {
  constructor(nombre, precio, marca, img, stock, indice) {
    this.nombre = nombre;
    this.precio = precio;
    this.marca = marca;
    this.img = img;
    this.stock = stock;
    this.cantidad = 0;
    this.indice = indice;
    this.borrar = (origen) => {
      // console.log(this);
      FIREBASE_DB.collection("productos")
        .get()
        .then((querySnapshot) => {
          // console.log(querySnapshot.docs[indice].id);
          let test = querySnapshot.docs[indice].id;
          FIREBASE_DB.collection("productos")
          .doc(test)
          .delete()
          .then(() => {
            mostrarMensajeBorrado(origen);
          })
          .catch((error) => {
            console.error("Error al borrar el producto: ", error);
          });
        });
    };
  }
}
