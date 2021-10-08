let clientes = [123, 456, 789];
const NUM_ADMIN = 41002878;

function login() {
  let numeroClienteIngresado = document.getElementById("username-input").value;

  if (parseInt(numeroClienteIngresado) === NUM_ADMIN) {
    // firebase login with google to enable write permission
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(result => {
      console.log(result);
      location.href = "/src/admin-panel.html";
    })
    .catch(err => {
      console.log(err);
    });
  } else if (clientes.includes(parseInt(numeroClienteIngresado))) {
    localStorage.setItem("numCliente", numeroClienteIngresado);
    location.href = "/src/home.html";
    console.log("entraste");
  } else {
    document.getElementById("username-input").style.border =
      "2px solid #b80000";
    document.getElementById("input-error").style.display = "flex";
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
