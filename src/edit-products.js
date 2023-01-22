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
    console.log(baseDeDatos[i].precio);
    listaProductos += `
      <div class="product">
        <img
          class="product-img"
          src="/src/img/products/${baseDeDatos[i].img}"
          alt="imagen-del-producto"
          loading="lazy"
          onerror="this.onerror=null;this.src='/src/img/no-img.png';"
        />
        <div class="product-info">
        Imagen: <input id="imagen" type="file" />
        Nombre: 
        <div>
          <input type="text" id="nombre"  value="${baseDeDatos[i].nombre}"></input>
        </div>
        Codigo: 
        <div>
          <input type="text" id="codigo"  value="${baseDeDatos[i].codigo}"></input>
        </div>
        Precio: 
        <div class="precio-container">
          <input type="number" id="precio" class="product-price" value=${baseDeDatos[i].precio}></input>
        </div>
        Stock: 
        <div>
          <input type="number" id="stock" class="product-stock" value=${baseDeDatos[i].stock}></input>
        </div>
        </div>
        <div class="logo-marca-container">
          <img src="img/logos/${baseDeDatos[i].marca}-logo.png" class="logo-img">
          <button class="boton-guardar" onclick="listadoProductos[${i}].actualizar(this)">Guardar</button>
          <a id="delete-item" onclick="listadoProductos[${i}].borrar(this)"><i class="delete-item-icon fas fa-trash fa-lg"></i></a>
        </div>
      </div>`;
  }
  document.getElementById("products").innerHTML = listaProductos;
}

function obtenerLinkImg(imagen) {
  if (imagen) {
    let startIndex =
      imagen.indexOf("\\") >= 0
        ? imagen.lastIndexOf("\\")
        : imagen.lastIndexOf("/");
    let filename = imagen.substring(startIndex);
    if (filename.indexOf("\\") === 0 || filename.indexOf("/") === 0) {
      filename = filename.substring(1);
    }
    return "img/products/" + filename;
  }
  else {
    return "";
  }
}

function mostrarMensajeBorrado(origen) {
  console.log("producto borrado exitosamente.");
  $("#mensaje-borrado").slideDown(400, () => {
    $("#mensaje-borrado").delay(1000).slideUp(400);
  });
  $(origen.parentElement.parentElement).fadeOut();
};

function mostrarMensajeActualizado() {
  $("#mensaje-actualizado").slideDown(400, () => {
    $("#mensaje-actualizado").delay(1000).slideUp(400);
  });
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
          let id = querySnapshot.docs[indice].id;
          FIREBASE_DB.collection("productos")
            .doc(id)
            .delete()
            .then(() => {
              mostrarMensajeBorrado(origen);
            })
            .catch((error) => {
              console.error("Error al borrar el producto - ", error);
            });
        });
    };
    this.actualizar = (origen) => {
      let img = obtenerLinkImg(origen.parentElement.parentElement.querySelector(
        ".product-info #imagen"
      ).value);
      let nombre = origen.parentElement.parentElement.querySelector(
        ".product-info #nombre"
      ).value;
      let codigo = origen.parentElement.parentElement.querySelector(
        ".product-info #codigo"
      ).value;
      let precio = origen.parentElement.parentElement.querySelector(
        ".product-info #precio"
      ).value;
      let stock = origen.parentElement.parentElement.querySelector(
        ".product-info #stock"
      ).value;
      console.log(img);
      console.log(nombre);
      console.log(codigo);
      console.log(precio);
      console.log(stock);
      FIREBASE_DB.collection("productos")
        .get()
        .then((querySnapshot) => {
          let id = querySnapshot.docs[indice].id;

          FIREBASE_DB.collection("productos").doc(id).update({ img: img });
          FIREBASE_DB.collection("productos").doc(id).update({ nombre: nombre });
          FIREBASE_DB.collection("productos").doc(id).update({ codigo: codigo });
          FIREBASE_DB.collection("productos").doc(id).update({ precio: precio });
          FIREBASE_DB.collection("productos").doc(id).update({ stock: stock });
          mostrarMensajeActualizado();

        })
        .catch((error) => {
          console.log(error);
        });
    };
  }
}
