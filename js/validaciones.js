// =========================================
// Validaciones de los campos con ValidateJS
// Cada función devuelve el mensaje de error, o "" si el valor es correcto.
// =========================================

// Reglas (constraints) de cada campo
const REGLAS = {
  pin: {
    presence: { allowEmpty: false, message: "^Ingrese su PIN." },
    format: { pattern: "\\d{4}", message: "^El PIN debe tener 4 dígitos." }
  },
  monto: {
    presence: { allowEmpty: false, message: "^Ingrese un monto mayor que cero." },
    numericality: { greaterThan: 0, message: "^Ingrese un monto mayor que cero." }
  },
  servicio: {
    presence: { allowEmpty: false, message: "^Seleccione el servicio a pagar." }
  },
  referencia: {
    presence: { allowEmpty: false, message: "^Ingrese el número de referencia (NIC)." },
    format: { pattern: "\\d+", message: "^El número de referencia solo debe tener números." }
  }
};

// Revisa un valor con su regla y devuelve el primer error que encuentre
function validarCampo(nombre, valor) {
  const datos = {};
  datos[nombre] = valor;
  const reglas = {};
  reglas[nombre] = REGLAS[nombre];

  const errores = validate(datos, reglas);
  return errores ? errores[nombre][0] : "";
}

// PIN: obligatorio, 4 dígitos, solo números
function validarPin(pin) {
  return validarCampo("pin", pin);
}

// Monto: obligatorio y mayor que cero
function validarMonto(valor) {
  return validarCampo("monto", valor);
}

// Servicio: debe elegirse uno. Referencia (NIC): obligatoria y solo números
function validarServicio(servicio, referencia) {
  return validarCampo("servicio", servicio) || validarCampo("referencia", referencia);
}
