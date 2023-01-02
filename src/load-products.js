const FIREBASE_DB = firebase.firestore();

// $(function () {
//   $.getJSON("listaRepuestos.json", function (data) {
//     for (let i = 0; i < data.length; i++) {
//       console.log(data[i]);
//       FIREBASE_DB.collection("productos").add({
//         nombre: data[i].nombre,
//         precio: data[i].precio,
//         marca: data[i].marca,
//         codigo: data[i].codigo,
//         descripcion: data[i].descripcion,
//         stock: data[i].stock,
//         img: data[i].img
//       });
//     }    
//   });
// });


$("#boton-submit").on("click", () => {
  let nombre = document.getElementById("pnombre");
  let precio = document.getElementById("pprecio");
  let marca = document.getElementById("pmarca");
  let codigo = document.getElementById("pcodigo");
  let descripcion = document.getElementById("pdescripcion");
  let stock = document.getElementById("pstock");
  let img = document.getElementById("image-file");

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

  FIREBASE_DB.collection("productos").add({
    nombre: nombre.value,
    precio: precio.value,
    marca: marca.value,
    codigo: codigo.value,
    descripcion: descripcion.value,
    img: obtenerLinkImg(img.value),
    stock: stock.value,
  });

  document.getElementById("input-form").reset();
  mostrarMensajeCargado();
});

function mostrarMensajeCargado(producto) {
  $("#mensaje-cargado").slideDown(400, () => {
    $("#mensaje-cargado").delay(2000).slideUp(400);
  });
  document.getElementById("mensaje-cargado").style.display = "flex";
}

$('#boton-volver').on('click', () => {
  location.href = '/src/admin-panel.html';
});