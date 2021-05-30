let clientes = [123, 456, 789];

function login() {
  let numeroClienteIngresado = document.getElementById("username-input").value;

  if (clientes.includes(parseInt(numeroClienteIngresado))) {
    localStorage.setItem("numCliente", numeroClienteIngresado);
    location.href = "home.html";
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
