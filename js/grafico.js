// =========================================
// Pantalla de gráfico: análisis por tipo desde LocalStorage
// Usa obtenerTransacciones() y formatoDinero() de datos.js
// =========================================

const TIPOS_GRAFICO = [
  { tipo: "Depósito", clase: "deposito" },
  { tipo: "Retiro", clase: "retiro" },
  { tipo: "Consulta de saldo", clase: "consulta" },
  { tipo: "Pago de servicio", clase: "servicio" }
];

const COLORES_SERVICIO = ["bg-warning", "bg-info", "bg-primary", "bg-success"];

function contarPorTipo(transacciones) {
  const conteos = {};
  TIPOS_GRAFICO.forEach(function (item) {
    conteos[item.tipo] = 0;
  });
  transacciones.forEach(function (tx) {
    if (conteos[tx.tipo] !== undefined) {
      conteos[tx.tipo]++;
    }
  });
  return conteos;
}

function periodoResumen(transacciones) {
  if (transacciones.length === 0) {
    const ahora = new Date();
    return ahora.toLocaleDateString("es-SV", { month: "long", year: "numeric" });
  }
  const ultima = transacciones[transacciones.length - 1].fecha;
  const partes = ultima.split(",")[0].split("/");
  if (partes.length >= 2) {
    const mes = Number(partes[1]) - 1;
    const anio = partes[2] ? Number(partes[2]) : new Date().getFullYear();
    const fecha = new Date(anio, mes, 1);
    return fecha.toLocaleDateString("es-SV", { month: "long", year: "numeric" });
  }
  return ultima;
}

function mostrarResumen(transacciones) {
  const el = document.getElementById("resumenGrafico");
  if (!el) return;
  const total = transacciones.length;
  const etiqueta = total === 1 ? "transacción" : "transacciones";
  el.textContent = periodoResumen(transacciones) + " · Total: " + total + " " + etiqueta;
}

// Gráfico de barras con Chart.js: número de transacciones de cada tipo
function mostrarBarrasPorTipo(conteos) {
  const etiquetas = ["Depósitos", "Retiros", "Consultas", "Servicios"];
  const valores = TIPOS_GRAFICO.map(function (item) {
    return conteos[item.tipo];
  });

  new Chart(document.getElementById("graficoTipos"), {
    type: "bar",
    data: {
      labels: etiquetas,
      datasets: [{
        label: "Transacciones",
        data: valores,
        // Verde para depósitos, rojo para retiros, gris para consultas y amarillo para servicios
        backgroundColor: ["#087451", "#bd0010", "#6c757d", "#e8a33d"]
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });
}

function nombreServicio(detalle) {
  const idx = detalle.indexOf(" (NIC");
  return idx >= 0 ? detalle.slice(0, idx).trim() : detalle.trim();
}

function agruparGastosServicios(transacciones) {
  const mapa = {};
  transacciones.forEach(function (tx) {
    if (tx.tipo !== "Pago de servicio") return;
    const nombre = nombreServicio(tx.detalle);
    const monto = Math.abs(tx.monto);
    mapa[nombre] = (mapa[nombre] || 0) + monto;
  });
  return Object.keys(mapa)
    .map(function (nombre) {
      return { nombre: nombre, monto: mapa[nombre] };
    })
    .sort(function (a, b) {
      return b.monto - a.monto;
    });
}

function mostrarGastosServicios(transacciones) {
  const titulo = document.getElementById("tituloServicios");
  const lista = document.getElementById("listaServicios");
  if (!titulo || !lista) return;

  const servicios = agruparGastosServicios(transacciones);
  const total = servicios.reduce(function (suma, s) {
    return suma + s.monto;
  }, 0);

  titulo.textContent = "Gastos en servicios (" + formatoDinero(total) + ")";

  if (total === 0) {
    lista.innerHTML = '<p class="text-muted mb-0">Aún no hay pagos de servicios.</p>';
    return;
  }

  lista.innerHTML = "";
  servicios.forEach(function (s, i) {
    const porcentaje = ((s.monto / total) * 100).toFixed(1);
    const color = COLORES_SERVICIO[i % COLORES_SERVICIO.length];
    const esUltimo = i === servicios.length - 1;
    const bloque =
      '<p class="mb-1">' + s.nombre + " · " + formatoDinero(s.monto) + "</p>" +
      '<div class="progress' + (esUltimo ? "" : " mb-3") + '">' +
      '<div class="progress-bar ' + color + '" style="width: ' + porcentaje + '%">' + porcentaje + "%</div>" +
      "</div>";
    lista.insertAdjacentHTML("beforeend", bloque);
  });
}

function mostrarGraficos() {
  const transacciones = obtenerTransacciones();
  mostrarResumen(transacciones);
  mostrarBarrasPorTipo(contarPorTipo(transacciones));
  mostrarGastosServicios(transacciones);
}

mostrarGraficos();