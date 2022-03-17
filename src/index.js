const MAIL_ADMIN = "milirubio1975@gmail.com";

let clientes = [
  { mail: "milirubio1975@gmail.com", nombre: "Emilio Rubio" },
  { mail: "mateoverdaguer123@gmail.com", nombre: "Mateo Verdaguer" },
];

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
    for (let i = 0; i < clientes.length; i++) {
      console.log(clientes[i].mail);
      clientes[i].mail === mailClienteIngresado ? console.log("esta") : console.log("no esta");
      if (clientes[i].mail === mailClienteIngresado) {
        localStorage.setItem("mailCliente", clientes[i].mail);
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
