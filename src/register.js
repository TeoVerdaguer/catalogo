const FIREBASE_DB = firebase.firestore();
let listadoUsuarios = [];
let formValido;
// Access 'productos' from database
FIREBASE_DB.collection("usuarios")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // console.log(doc.data());
            listadoUsuarios.push(doc.data());
        });
        $("#cargando").hide();
        // getBaseDeDatosDeFirebase(productosDeFirebase);
    });

console.log(listadoUsuarios);

function cargando(valor) {
    let element = document.getElementById("cargando");

    valor
        ? (element.style.display = "block")
        : (element.style.display = "none");
}

function desactivarBotonRegistro() {
  document.getElementById("boton-registro").disabled = true;
}

function mostrarMensajeRegistrado() {
    cargando(false);
    document.getElementById("boton-registro").disabled = true;
    document.getElementById('mensaje-exitoso').style.display = 'block';

}

function validarForm(mail, nombre, razon, cuit, tel) {
    if (mail.length === 0) {
        console.log("mail vacio");
        formValido = false;
    } else {
      formValido = true;
    }
    
}

$("#boton-registro").on("click", () => {
    let mail = document.getElementById("new-user-email").value;
    let nombre = document.getElementById("new-user-nombre").value;
    let razon = document.getElementById("new-user-razon").value;
    let cuit = document.getElementById("new-user-cuit").value;
    let tel = document.getElementById("new-user-tel").value;

    validarForm(mail, nombre, razon, cuit, tel);
    cargando(true);
    if (formValido) {
        FIREBASE_DB.collection("usuarios")
            .add({
                mail: mail,
                nombre: nombre,
                razon: razon,
                cuit: cuit,
                tel: tel,
            })
            .then(mostrarMensajeRegistrado());
    } else {
      document.getElementById('mensaje-error').style.display = 'block';
    }
});
