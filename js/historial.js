// =========================================
// Pantalla de historial: muestra las transacciones guardadas en LocalStorage
// Usa obtenerUsuario(), obtenerTransacciones() y formatoDinero() de datos.js
// =========================================

// Resumen por tipo: cuántas hay de cada una y cuánto suman
function mostrarResumenHistorial(transacciones) {
  const tipos = {
    "Depósito": "resumenDepositos",
    "Retiro": "resumenRetiros",
    "Pago de servicio": "resumenServicios",
    "Consulta de saldo": "resumenConsultas"
  };

  Object.keys(tipos).forEach(function (tipo) {
    const lista = transacciones.filter(function (tx) { return tx.tipo === tipo; });
    const total = lista.reduce(function (suma, tx) { return suma + Math.abs(tx.monto); }, 0);
    const tarjeta = document.getElementById(tipos[tipo]);
    tarjeta.querySelector(".cantidad").textContent = lista.length;
    tarjeta.querySelector(".total").textContent =
      (tipo === "Depósito" ? "+ " : tipo === "Consulta de saldo" ? "" : "- ") + formatoDinero(total);
  });
}

// Tabla: la transacción más reciente aparece primero
function mostrarTablaHistorial(transacciones) {
  const tabla = document.getElementById("tablaHistorial");
  tabla.innerHTML = "";

  if (transacciones.length === 0) {
    tabla.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Aún no hay transacciones.</td></tr>';
    return;
  }

  transacciones.slice().reverse().forEach(function (tx) {
    // Depósitos en verde, retiros y pagos en rojo, consultas sin color
    let clase = "";
    let signo = "";
    if (tx.monto > 0) { clase = "positivo"; signo = "+ "; }
    if (tx.monto < 0) { clase = "negativo"; signo = "- "; }

    const fila =
      "<tr>" +
      "<td>" + tx.fecha + "</td>" +
      "<td>" + tx.tipo + "</td>" +
      "<td>" + tx.detalle + "</td>" +
      '<td class="text-right ' + clase + '">' + signo + formatoDinero(Math.abs(tx.monto)) + "</td>" +
      "</tr>";
    tabla.insertAdjacentHTML("beforeend", fila);
  });
}

const usuarioHistorial = obtenerUsuario();
document.getElementById("datosCuenta").textContent =
  usuarioHistorial.nombre + " · Cuenta " + usuarioHistorial.cuenta;
document.getElementById("saldoActual").textContent = formatoDinero(usuarioHistorial.saldo);

const transaccionesHistorial = obtenerTransacciones();
mostrarResumenHistorial(transaccionesHistorial);
mostrarTablaHistorial(transaccionesHistorial);
