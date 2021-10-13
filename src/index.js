const NUM_ADMIN = 41002878;

let clientes = [
  { numero: 123, nombre: "Mateo Verdaguer" },
  { numero: 456, nombre: "Constanza Verdaguer" },
];

function login() {
  let numeroClienteIngresado = document.getElementById("username-input").value;

  if (parseInt(numeroClienteIngresado) === NUM_ADMIN) {
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
    for (let i = 0; i < clientes.length; i++) {
      if (clientes[i].numero === parseInt(numeroClienteIngresado)) {
        localStorage.setItem("numCliente", clientes[i].numero);
        localStorage.setItem("nombreCliente", clientes[i].nombre);
        location.href = "/src/home.html";
        break;
      } else {
        document.getElementById("username-input").style.border =
          "2px solid #b80000";
        document.getElementById("input-error").style.display = "flex";
      }
    }
  }
};

$("#boton-login").on("click", () => {
  login();
});

$("#username-input").on("keyup", (event) => {
  if (event.keyCode === 13) {
    login();
  }
});
