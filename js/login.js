// Login: teclado numérico y revisión del PIN guardado en LocalStorage
// PIN de prueba del usuario Ash Ketchum: 1234

const pin = document.getElementById("pin");
const error = document.getElementById("error");

// Cada número del teclado se agrega al PIN (máximo 4)
document.querySelectorAll(".teclado .btn[type='button']").forEach(function (boton) {
  boton.addEventListener("click", function () {
    error.textContent = "";
    if (boton.id === "borrar") {
      pin.value = pin.value.slice(0, -1);
    } else if (pin.value.length < 4) {
      pin.value += boton.textContent;
    }
  });
});

// Al dar OK se valida el PIN y se compara con el del usuario
document.getElementById("formLogin").addEventListener("submit", function (e) {
  e.preventDefault();

  // validarPin() está en validaciones.js
  const mensajeError = validarPin(pin.value);
  if (mensajeError) {
    error.textContent = mensajeError;
    return;
  }

  const usuario = obtenerUsuario();
  if (pin.value === usuario.pin) {
    iniciarSesion();
    // mostrarMensaje() está en dialogos.js
    mostrarMensaje("Bienvenido", "Hola, " + usuario.nombre, "success").then(function () {
      window.location.href = "acciones.html";
    });
  } else {
    error.textContent = "PIN incorrecto, intente de nuevo.";
    mostrarMensaje("PIN incorrecto", "El PIN ingresado no es correcto.", "error");
    pin.value = "";
  }
});
