const MAIL_ADMIN = "milirubio1975@gmail.com";
let listadoUsuarios = [];
const FIREBASE_DB = firebase.firestore();

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

function login() {
    let mailClienteIngresado = document.getElementById("username-input").value;
    console.log(mailClienteIngresado);

    if (mailClienteIngresado === MAIL_ADMIN) {
        // firebase login with google to enable write permission
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
                console.log(result);
                location.href = "/src/admin-panel.html";
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        for (let i = 0; i < listadoUsuarios.length; i++) {
            console.log(listadoUsuarios[i].mail);
            listadoUsuarios[i].mail === mailClienteIngresado
                ? console.log("esta")
                : console.log("no esta");
            if (listadoUsuarios[i].mail === mailClienteIngresado) {
                localStorage.setItem("mailCliente", listadoUsuarios[i].mail);
                localStorage.setItem(
                    "nombreCliente",
                    listadoUsuarios[i].nombreNegocio
                );
                location.href = "/src/home.html";
                break;
            }
        }
        location.href = '/src/register.html';
    }
}

$("#boton-login").on("click", () => {
    login();
});

$("#username-input").on("keyup", (event) => {
    if (event.keyCode === 13) {
        login();
    }
});
