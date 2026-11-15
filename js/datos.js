// =========================================
// Datos del usuario y transacciones (LocalStorage)
// Este archivo se carga en todas las pantallas
// =========================================

// Datos del usuario de prueba que pide el proyecto
const USUARIO_INICIAL = {
  nombre: "Ash Ketchum",
  pin: "1234",
  cuenta: "0987654321",
  saldo: 500.00
};

// La primera vez que se abre la app, se guardan los datos en LocalStorage.
// LocalStorage solo guarda texto, por eso se usa JSON.stringify()
function inicializarDatos() {
  if (!localStorage.getItem("usuario")) {
    localStorage.setItem("usuario", JSON.stringify(USUARIO_INICIAL));
  }
  if (!localStorage.getItem("transacciones")) {
    localStorage.setItem("transacciones", JSON.stringify([]));
  }
}

// Lee los datos del usuario (JSON.parse convierte el texto en objeto)
function obtenerUsuario() {
  return JSON.parse(localStorage.getItem("usuario"));
}

// Guarda los datos del usuario
function guardarUsuario(usuario) {
  localStorage.setItem("usuario", JSON.stringify(usuario));
}

// Devuelve la lista de transacciones guardadas
function obtenerTransacciones() {
  return JSON.parse(localStorage.getItem("transacciones")) || [];
}

// Registra una transacción y actualiza el saldo.
// Si el monto es positivo suma (depósito), si es negativo resta (retiro o pago)
function registrarTransaccion(tipo, monto, detalle) {
  const usuario = obtenerUsuario();
  usuario.saldo = Number((usuario.saldo + monto).toFixed(2));
  guardarUsuario(usuario);

  const transaccion = {
    tipo: tipo,
    monto: monto,
    detalle: detalle,
    fecha: new Date().toLocaleString("es-SV"),
    saldo: usuario.saldo
  };

  const transacciones = obtenerTransacciones();
  transacciones.push(transaccion);
  localStorage.setItem("transacciones", JSON.stringify(transacciones));
  return transaccion;
}

// Da formato de dinero: 500 -> $500.00
function formatoDinero(cantidad) {
  return "$" + Number(cantidad).toFixed(2);
}

// ---------- Sesión ----------
// Se usa sessionStorage para saber si el usuario ya ingresó su PIN

function iniciarSesion() {
  sessionStorage.setItem("sesion", "activa");
}

function cerrarSesion() {
  sessionStorage.removeItem("sesion");
  window.location.href = "index.html";
}

// Las pantallas internas tienen data-protegida en el body:
// si no se ha iniciado sesión, regresan al login
function verificarSesion() {
  if (document.body.dataset.protegida !== undefined && sessionStorage.getItem("sesion") !== "activa") {
    window.location.href = "index.html";
  }
}

// Todos los enlaces con la clase "salir" cierran la sesión
document.addEventListener("DOMContentLoaded", function () {
  verificarSesion();
  document.querySelectorAll(".salir").forEach(function (enlace) {
    enlace.addEventListener("click", function (e) {
      e.preventDefault();
      cerrarSesion();
    });
  });
});

inicializarDatos();
