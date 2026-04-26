// ═══════════════════════════════════════════
//  RSVP — Kevin & Lourdes
//  Pega este código en Apps Script y publica
//  como Web App (cualquiera, incluso anónimo)
// ═══════════════════════════════════════════

const SHEET_NAME = 'Hoja 1'; // Cambia si tu pestaña tiene otro nombre

function doPost(e) {
  try {
    // 1. Parsear los datos que llegan del formulario
    const data = JSON.parse(e.postData.contents);

    // 2. Abrir la hoja activa
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    // 3. Escribir una nueva fila
    sheet.appendRow([
      new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
      data.nombre    || '—',
      data.asistencia === 'si' ? '✅ Sí asiste' : '❌ No asiste',
      data.asistencia === 'si' ? (data.adultos || 1) : '—',
      data.asistencia === 'si' ? (data.ninos   || 0) : '—',
    ]);

    // 4. Responder con éxito (CORS incluido)
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Si algo falla, regresa el error para poder debuggear
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// doGet maneja el preflight CORS que algunos navegadores envían
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'RSVP endpoint activo' }))
    .setMimeType(ContentService.MimeType.JSON);
}
