// =========================================
// Diálogos con el usuario
// PENDIENTE (Josué): cambiar alert() y confirm() por SweetAlert.
// Mantener los mismos nombres de funciones porque login.js y acciones.js las usan.
// =========================================

// Muestra un mensaje. tipo: "success", "error", "warning" o "info"
// Devuelve una promesa para poder esperar a que el usuario cierre el mensaje
function mostrarMensaje(titulo, texto, tipo) {
  alert(titulo + "\n" + texto);
  return Promise.resolve();
}

// Pide confirmación. Devuelve una promesa con true (aceptó) o false (canceló)
function confirmar(titulo, texto) {
  return Promise.resolve(confirm(titulo + "\n" + texto));
}
