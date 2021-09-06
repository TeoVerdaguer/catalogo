const db = firebase.firestore();

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
        let startIndex = (imagen.indexOf('\\') >= 0 ? imagen.lastIndexOf('\\') : imagen.lastIndexOf('/'));
        let filename = imagen.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        return 'img/products/' + filename;
    }
  };

  db.collection("productos").add({
    "nombre": nombre.value,
    "precio": precio.value,
    "marca": marca.value,
    "codigo": codigo.value,
    "descripcion": descripcion.value,
    "img": obtenerLinkImg(img.value),
    "stock": stock.value
  });

  document.getElementById("input-form").reset();
});




