// Login: teclado numérico y revisión del PIN
// PIN de prueba del usuario Ash Ketchum: 1234

const pin = document.getElementById("pin");
const error = document.getElementById("error");

// Cada número del teclado se agrega al PIN (máximo 4)
document.querySelectorAll(".teclado .btn[type='button']").forEach(function (boton) {
  boton.addEventListener("click", function () {
    if (boton.id === "borrar") {
      pin.value = pin.value.slice(0, -1);
    } else if (pin.value.length < 4) {
      pin.value += boton.textContent;
    }
  });
});

// Al dar OK se revisa el PIN
document.getElementById("formLogin").addEventListener("submit", function (e) {
  e.preventDefault();
  if (pin.value === "1234") {
    window.location.href = "acciones.html";
  } else {
    error.textContent = "PIN incorrecto, intente de nuevo.";
    pin.value = "";
  }
});
