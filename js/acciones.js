// =========================================
// Pantalla de acciones: depósito, retiro, consulta de saldo y pago de servicios
// Usa las funciones de datos.js, validaciones.js, dialogos.js y comprobante.js
// =========================================

// Muestra el nombre, la cuenta y el saldo guardados en LocalStorage
function mostrarDatos() {
  const usuario = obtenerUsuario();
  document.getElementById("nombreUsuario").textContent = usuario.nombre;
  document.getElementById("cuentaUsuario").textContent = usuario.cuenta;
  document.querySelectorAll(".saldoUsuario").forEach(function (elemento) {
    elemento.textContent = formatoDinero(usuario.saldo);
  });
}

// Pasos que siguen todas las transacciones:
// confirmar -> revisar saldo -> registrar -> cerrar ventana -> ofrecer comprobante
function procesarTransaccion(datos) {
  // En retiros y pagos se revisa que el saldo alcance
  if (datos.esCargo && datos.monto > obtenerUsuario().saldo) {
    datos.campoError.textContent = "Saldo insuficiente.";
    mostrarMensaje("Saldo insuficiente", "Su saldo actual es " + formatoDinero(obtenerUsuario().saldo), "error");
    return;
  }

  confirmar("Confirmar " + datos.tipo.toLowerCase(), "¿Desea continuar con " + datos.tipo.toLowerCase() + " por " + formatoDinero(datos.monto) + "?")
    .then(function (acepto) {
      if (!acepto) return;

      const monto = datos.esCargo ? -datos.monto : datos.monto;
      const transaccion = registrarTransaccion(datos.tipo, monto, datos.detalle);

      $(datos.modal).modal("hide");
      mostrarDatos();

      mostrarMensaje("Transacción exitosa", "Su nuevo saldo es " + formatoDinero(transaccion.saldo), "success")
        .then(function () {
          return confirmar("Comprobante", "¿Desea descargar el comprobante en PDF?");
        })
        .then(function (descargar) {
          // generarComprobante() está en comprobante.js
          if (descargar) generarComprobante(transaccion);
        });
    });
}

// ---------- Depósito ----------
document.getElementById("btnDepositar").addEventListener("click", function () {
  const campo = document.getElementById("montoDeposito");
  const campoError = document.getElementById("errorDeposito");
  campoError.textContent = validarMonto(campo.value);
  if (campoError.textContent) return;

  procesarTransaccion({
    tipo: "Depósito", monto: Number(campo.value), detalle: "Depósito en efectivo",
    esCargo: false, modal: "#modalDeposito", campoError: campoError
  });
});

// ---------- Retiro ----------
// Los botones de montos rápidos ($20, $40, $100) llenan el campo
document.querySelectorAll(".monto-rapido").forEach(function (boton) {
  boton.addEventListener("click", function () {
    document.getElementById("montoRetiro").value = boton.dataset.monto;
  });
});

document.getElementById("btnRetirar").addEventListener("click", function () {
  const campo = document.getElementById("montoRetiro");
  const campoError = document.getElementById("errorRetiro");
  campoError.textContent = validarMonto(campo.value);
  if (campoError.textContent) return;

  procesarTransaccion({
    tipo: "Retiro", monto: Number(campo.value), detalle: "Retiro en cajero",
    esCargo: true, modal: "#modalRetiro", campoError: campoError
  });
});

// ---------- Consulta de saldo ----------
// Al abrir la ventana se muestra el saldo actual y se registra la consulta
$("#modalSaldo").on("show.bs.modal", function () {
  registrarTransaccion("Consulta de saldo", 0, "Saldo consultado");
  mostrarDatos();
});

// ---------- Pago de servicios ----------
document.getElementById("btnPagar").addEventListener("click", function () {
  const servicio = document.getElementById("servicio").value;
  const referencia = document.getElementById("referencia").value;
  const campo = document.getElementById("montoServicio");
  const campoError = document.getElementById("errorServicio");
  campoError.textContent = validarServicio(servicio, referencia) || validarMonto(campo.value);
  if (campoError.textContent) return;

  procesarTransaccion({
    tipo: "Pago de servicio", monto: Number(campo.value), detalle: servicio + " (NIC " + referencia + ")",
    esCargo: true, modal: "#modalServicios", campoError: campoError
  });
});

// Cada vez que se abre una ventana, se limpian sus campos y errores
$(".modal").on("show.bs.modal", function () {
  $(this).find("input").val("");
  $(this).find("select").val("");
  $(this).find(".mensaje-error").text("");
});

mostrarDatos();
