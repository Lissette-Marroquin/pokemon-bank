
// =========================================
// Diálogos con SweetAlert - Josué
// =========================================

// Muestra mensajes de éxito, error, advertencia o información
function mostrarMensaje(titulo, texto, tipo) {

  return swal({
    title: titulo,
    text: texto,
    icon: tipo || "info",
    button: "Aceptar"
  });

}

// Solicita confirmación antes de realizar una operación
function confirmar(titulo, texto) {

  return swal({
    title: titulo,
    text: texto,
    icon: "warning",
    buttons: ["Cancelar", "Aceptar"],
    dangerMode: false
  }).then(function (acepto) {

    return Boolean(acepto);

  });

}

