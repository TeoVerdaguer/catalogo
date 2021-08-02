let productosAgregados = [];

$("#boton-submit").on("click", () => {
  console.log("Producto cargado macho");

  let nombre = document.getElementById("pnombre");
  let precio = document.getElementById("pprecio");
  let marca = document.getElementById("pmarca");
  let codigo = document.getElementById("pcodigo");
  let descripcion = document.getElementById("pdescripcion");
  let stock = document.getElementById("pstock");
  let img = document.getElementById("image-file");

  productosAgregados.push({
      "nombre": nombre.value,
      "precio": precio.value,
      "marca": marca.value,
      "codigo": codigo.value,
      "descripcion": descripcion.value,
      "img": img.value,
      "stock": stock.value
  });
  console.log(productosAgregados);

  document.getElementById("input-form").reset();
});


// accede a la data del JSON y muestra los productos
// $(function () {
//     $.getJSON("data.json", function (data) {
//       $(() => {
//         data.productos.push(nuevoProducto);
//         console.log(data);
//       });
//     })
// });


// fs.writeFile('myjsonfile.json', json, 'utf8', callback);



