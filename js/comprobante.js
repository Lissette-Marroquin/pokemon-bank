// =========================================
// Comprobante de la transacción (PDF con jsPDF)
// Recibe el objeto transaccion: { tipo, monto, detalle, fecha, saldo }
// Los datos del usuario se obtienen con obtenerUsuario() de datos.js
// Requiere que jsPDF esté cargado antes que este archivo (ver acciones.html)
// =========================================

// Colores del banco (los mismos de css/styles.css), en formato [R, G, B]
const COLOR_ROJO = [189, 0, 16];
const COLOR_GRIS = [100, 110, 120];
const COLOR_TEXTO = [30, 35, 40];

// Dibuja un dato del comprobante: una etiqueta pequeña y debajo su valor.
// Devuelve la posición "y" donde debe dibujarse el siguiente dato.
function dibujarDato(doc, etiqueta, valor, y) {
  const ancho = 80; // ancho de la hoja en mm

  // Etiqueta (texto pequeño y gris)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_GRIS);
  doc.text(etiqueta.toUpperCase(), 8, y);

  // Valor (texto en negrita). Si es muy largo se divide en varias líneas
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_TEXTO);
  const lineas = doc.splitTextToSize(String(valor), ancho - 16);
  doc.text(lineas, 8, y + 4.5);

  // Cada línea extra del valor empuja el siguiente dato hacia abajo
  return y + 11 + (lineas.length - 1) * 4.5;
}

// Genera y descarga el comprobante en PDF de una transacción
function generarComprobante(transaccion) {
  // Si la librería no cargó (por ejemplo, sin internet), se avisa al usuario
  if (!window.jspdf) {
    mostrarMensaje("No se pudo generar el comprobante", "No se cargó la librería jsPDF. Revise su conexión a internet.", "error");
    return;
  }

  const { jsPDF } = window.jspdf;
  const usuario = obtenerUsuario();

  // Hoja pequeña tipo ticket de cajero: 80 mm de ancho por 145 mm de alto
  const doc = new jsPDF({ unit: "mm", format: [80, 145] });

  // ----- Encabezado rojo con el nombre del banco -----
  doc.setFillColor(...COLOR_ROJO);
  doc.rect(0, 0, 80, 24, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Pokémon Bank", 40, 12, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Comprobante de transacción", 40, 19, { align: "center" });

  // ----- Datos de la transacción -----
  let y = 34;
  y = dibujarDato(doc, "Cliente", usuario.nombre, y);
  y = dibujarDato(doc, "Cuenta N.º", usuario.cuenta, y);
  y = dibujarDato(doc, "Tipo de transacción", transaccion.tipo, y);
  y = dibujarDato(doc, "Detalle", transaccion.detalle, y);
  // Math.abs() quita el signo negativo de retiros y pagos para mostrar solo el monto
  y = dibujarDato(doc, "Monto", formatoDinero(Math.abs(transaccion.monto)), y);
  y = dibujarDato(doc, "Fecha y hora", transaccion.fecha, y);

  // ----- Línea punteada que separa el saldo final -----
  y += 1;
  doc.setDrawColor(...COLOR_GRIS);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(8, y, 72, y);
  doc.setLineDashPattern([], 0); // vuelve a línea continua

  // ----- Saldo final -----
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_GRIS);
  doc.text("SALDO FINAL", 40, y + 8, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...COLOR_ROJO);
  doc.text(formatoDinero(transaccion.saldo), 40, y + 17, { align: "center" });

  // ----- Pie del comprobante -----
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_GRIS);
  doc.text("Conserve este comprobante. Gracias por usar Pokémon Bank.", 40, y + 26, { align: "center" });

  // Descarga el archivo. El nombre lleva la hora para que no se repita
  doc.save("comprobante-pokemon-bank-" + Date.now() + ".pdf");
}