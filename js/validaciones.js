// =========================================
// Validaciones de los campos
// PENDIENTE (José): hacer estas validaciones con ValidateJS.
// Cada función devuelve el mensaje de error, o "" si el valor es correcto.
// =========================================

// PIN: obligatorio, 4 dígitos, solo números
function validarPin(pin) {
  if (!/^\d{4}$/.test(pin)) return "El PIN debe tener 4 dígitos.";
  return "";
}

// Monto: obligatorio y mayor que cero
function validarMonto(valor) {
  if (valor === "" || Number(valor) <= 0) return "Ingrese un monto mayor que cero.";
  return "";
}

// Servicio: debe elegirse uno. Referencia (NIC): obligatoria y solo números
function validarServicio(servicio, referencia) {
  if (servicio === "") return "Seleccione el servicio a pagar.";
  if (!/^\d+$/.test(referencia)) return "El número de referencia solo debe tener números.";
  return "";
}
